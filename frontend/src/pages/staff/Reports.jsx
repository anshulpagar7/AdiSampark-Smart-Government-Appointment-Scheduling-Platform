import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "../../lib/supabase";
import { useRealtime } from "../../hooks/useRealtime";

// ─── helpers ────────────────────────────────────────────────────────────────

const today = () => new Date().toISOString().split("T")[0];

const fmt = (d) =>
  new Date(d).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const fmtTime = (t) => {
  if (!t) return "—";
  const [h, m] = t.split(":");
  const hr = parseInt(h);
  const ampm = hr >= 12 ? "PM" : "AM";
  return `${hr % 12 || 12}:${m} ${ampm}`;
};

const fmtDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const pct = (n, total) => (total === 0 ? 0 : Math.round((n / total) * 100));

const STATUS_COLORS = {
  Completed: "#10b981",
  Waiting: "#f59e0b",
  "No Show": "#ef4444",
  "Reschedule Required": "#8b5cf6",
  Approved: "#3b82f6",
  Cancelled: "#6b7280",
  Upcoming: "#06b6d4",
};

const PILL_BG = {
  Completed: "#d1fae5",
  Waiting: "#fef3c7",
  "No Show": "#fee2e2",
  "Reschedule Required": "#ede9fe",
  Approved: "#dbeafe",
  Cancelled: "#f3f4f6",
  Upcoming: "#cffafe",
  Scheduled: "#dbeafe",
};

const PURPOSE_COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#06b6d4",
  "#ec4899",
];

// ─── date range helper ────────────────────────────────────────────────────────

function getDateRange(filter, customDate) {
  const now = new Date();
  if (filter === "today") {
    const s = now.toISOString().split("T")[0];
    return { start: s, end: s };
  }
  if (filter === "week") {
    const day = now.getDay();
    const mon = new Date(now);
    mon.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
    return {
      start: mon.toISOString().split("T")[0],
      end: now.toISOString().split("T")[0],
    };
  }
  if (filter === "month") {
    const s = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .split("T")[0];
    return { start: s, end: now.toISOString().split("T")[0] };
  }
  if (filter === "custom" && customDate) {
    return { start: customDate, end: customDate };
  }
  const s = now.toISOString().split("T")[0];
  return { start: s, end: s };
}

// ─── sub-components ──────────────────────────────────────────────────────────

function KpiCard({ title, count, sub, pctVal, color, icon, delay = 0 }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: `linear-gradient(135deg, ${color}18 0%, ${color}08 100%)`,
        border: `1.5px solid ${color}30`,
        borderRadius: 16,
        padding: "20px 22px",
        flex: "1 1 160px",
        minWidth: 150,
        transition: "transform 0.22s ease, box-shadow 0.22s ease",
        transform: hovered ? "translateY(-4px) scale(1.02)" : "none",
        boxShadow: hovered
          ? `0 12px 32px ${color}22`
          : "0 2px 8px rgba(0,0,0,0.06)",
        cursor: "default",
        animationDelay: `${delay}ms`,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 10,
        }}
      >
        <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase" }}>
          {title}
        </span>
        <span style={{ fontSize: 20 }}>{icon}</span>
      </div>
      <div style={{ fontSize: 32, fontWeight: 800, color, lineHeight: 1 }}>
        {count}
      </div>
      {sub !== undefined && (
        <div style={{ marginTop: 6, fontSize: 12, color: "#94a3b8" }}>
          {sub}
          {pctVal !== undefined && (
            <span
              style={{
                marginLeft: 6,
                background: `${color}20`,
                color,
                borderRadius: 6,
                padding: "1px 7px",
                fontWeight: 700,
                fontSize: 11,
              }}
            >
              {pctVal}%
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function StatusPill({ status }) {
  return (
    <span
      style={{
        background: PILL_BG[status] || "#f3f4f6",
        color: STATUS_COLORS[status] || "#374151",
        borderRadius: 20,
        padding: "3px 11px",
        fontSize: 11,
        fontWeight: 700,
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </span>
  );
}

// ─── Charts ──────────────────────────────────────────────────────────────────

function DonutChart({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const segments = useMemo(() => {
    let cum = 0;
    return data.map((d) => {
      const frac = total === 0 ? 0 : (d.value / total) * 360;
      const start = cum;
      cum += frac;
      return { ...d, start, frac };
    });
  }, [data, total]);

  const gradient = segments
    .map((s) => `${s.color} ${s.start}deg ${s.start + s.frac}deg`)
    .join(", ");

  return (
    <div style={{ display: "flex", gap: 28, alignItems: "center", flexWrap: "wrap" }}>
      <div
        style={{
          width: 150,
          height: 150,
          borderRadius: "50%",
          background: total === 0 ? "#e2e8f0" : `conic-gradient(${gradient})`,
          position: "relative",
          flexShrink: 0,
          boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            width: 84,
            height: 84,
            borderRadius: "50%",
            background: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 800, color: "#1e293b" }}>{total}</div>
          <div style={{ fontSize: 9, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase" }}>Total</div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        {data.map((d) => (
          <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: d.color, flexShrink: 0 }} />
            <span style={{ fontSize: 12, color: "#374151", flex: 1 }}>{d.label}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#1e293b" }}>{d.value}</span>
            <span style={{ fontSize: 11, color: "#94a3b8", width: 36, textAlign: "right" }}>
              {pct(d.value, total)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PurposeBar({ data }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {data.map((d, i) => (
        <div key={d.label}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ fontSize: 12, color: "#374151", fontWeight: 500 }}>{d.label}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#1e293b" }}>{d.value}</span>
          </div>
          <div style={{ height: 8, background: "#f1f5f9", borderRadius: 8, overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${(d.value / max) * 100}%`,
                background: PURPOSE_COLORS[i % PURPOSE_COLORS.length],
                borderRadius: 8,
                transition: "width 0.9s cubic-bezier(.4,0,.2,1)",
              }}
            />
          </div>
        </div>
      ))}
      {data.length === 0 && <div style={{ color: "#94a3b8", fontSize: 13, textAlign: "center" }}>No data</div>}
    </div>
  );
}

function HourlyBar({ data }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 120, overflowX: "auto" }}>
      {data.map((d, i) => (
        <div key={d.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "0 0 auto" }}>
          <div style={{ fontSize: 10, color: "#94a3b8", marginBottom: 3, fontWeight: 600 }}>{d.value || ""}</div>
          <div
            style={{
              width: 28,
              height: `${(d.value / max) * 100}%`,
              minHeight: d.value ? 4 : 0,
              background: `linear-gradient(180deg, #3b82f6, #6366f1)`,
              borderRadius: "5px 5px 0 0",
              transition: "height 0.9s cubic-bezier(.4,0,.2,1)",
              boxShadow: "0 2px 8px #3b82f622",
            }}
          />
          <div style={{ fontSize: 9, color: "#94a3b8", marginTop: 4, whiteSpace: "nowrap" }}>{d.label}</div>
        </div>
      ))}
    </div>
  );
}

function OfficerCard({ name, total, completed, pending }) {
  const completionPct = pct(completed, total);
  return (
    <div
      style={{
        background: "linear-gradient(135deg,#eff6ff,#f0fdf4)",
        border: "1.5px solid #bfdbfe",
        borderRadius: 14,
        padding: "18px 20px",
        minWidth: 200,
        flex: "1 1 200px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#3b82f6,#6366f1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 800,
            fontSize: 14,
          }}
        >
          {name.charAt(0)}
        </div>
        <div>
          <div style={{ fontWeight: 700, color: "#1e293b", fontSize: 14 }}>{name}</div>
          <div style={{ fontSize: 11, color: "#64748b" }}>Appointment Officer</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 12, flexWrap: "wrap" }}>
        {[
          { label: "Total", val: total, color: "#3b82f6" },
          { label: "Done", val: completed, color: "#10b981" },
          { label: "Pending", val: pending, color: "#f59e0b" },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              flex: "1 1 60px",
              background: "#fff",
              borderRadius: 10,
              padding: "8px 10px",
              textAlign: "center",
              border: `1px solid ${s.color}30`,
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 800, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ fontSize: 11, color: "#64748b" }}>Completion Rate</span>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#10b981" }}>{completionPct}%</span>
        </div>
        <div style={{ height: 6, background: "#e2e8f0", borderRadius: 6, overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${completionPct}%`,
              background: "linear-gradient(90deg,#10b981,#059669)",
              borderRadius: 6,
              transition: "width 0.9s ease",
            }}
          />
        </div>
      </div>
    </div>
  );
}

function MeetingSummaryCard({ label, value, color, icon }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: `linear-gradient(135deg,${color}18,${color}06)`,
        border: `1.5px solid ${color}30`,
        borderRadius: 12,
        padding: "14px 16px",
        flex: "1 1 100px",
        textAlign: "center",
        transition: "transform 0.2s,box-shadow 0.2s",
        transform: hov ? "translateY(-3px)" : "none",
        boxShadow: hov ? `0 8px 24px ${color}20` : "0 1px 4px rgba(0,0,0,0.05)",
      }}
    >
      <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontSize: 24, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 11, color: "#64748b", fontWeight: 600, marginTop: 2 }}>{label}</div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Reports() {
  const [appointments, setAppointments] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [filter, setFilter] = useState("today");
  const [customDate, setCustomDate] = useState("");
  const [loading, setLoading] = useState(true);

  const { start, end } = useMemo(
    () => getDateRange(filter, customDate),
    [filter, customDate]
  );

  const fetchAppointments = useCallback(async () => {
    const { data } = await supabase
      .from("appointments")
      .select("*")
      .gte("appointment_date", start)
      .lte("appointment_date", end)
      .order("appointment_date", { ascending: false });
    setAppointments(data || []);
    setLoading(false);
  }, [start, end]);

  const fetchMeetings = useCallback(async () => {
    const { data } = await supabase
      .from("executive_meetings")
      .select("*")
      .gte("meeting_date", start)
      .lte("meeting_date", end)
      .order("meeting_date", { ascending: false });
    setMeetings(data || []);
  }, [start, end]);

  useEffect(() => {
    setLoading(true);
    fetchAppointments();
    fetchMeetings();
  }, [fetchAppointments, fetchMeetings]);

  useRealtime({
    appointments: fetchAppointments,
    executive_meetings: fetchMeetings,
  });

  // ─── derived KPIs ──────────────────────────────────────────────────────────

  const total = appointments.length;
  const completed = appointments.filter((a) => a.status === "Completed").length;
  const waiting = appointments.filter((a) => a.status === "Waiting").length;
  const noShow = appointments.filter((a) => a.status === "No Show").length;
  const reschedule = appointments.filter((a) => a.status === "Reschedule Required").length;
  const totalMeetings = meetings.length;

  // ─── donut data ────────────────────────────────────────────────────────────

  const donutData = useMemo(() => {
    const statuses = ["Completed", "Waiting", "No Show", "Reschedule Required", "Approved"];
    return statuses.map((s) => ({
      label: s,
      value: appointments.filter((a) => a.status === s).length,
      color: STATUS_COLORS[s],
    }));
  }, [appointments]);

  // ─── purpose data ──────────────────────────────────────────────────────────

  const purposeData = useMemo(() => {
    const map = {};
    appointments.forEach((a) => {
      const p = a.purpose || "Other";
      map[p] = (map[p] || 0) + 1;
    });
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([label, value]) => ({ label, value }));
  }, [appointments]);

  // ─── hourly data ───────────────────────────────────────────────────────────

  const hourlyData = useMemo(() => {
    const hours = {};
    for (let h = 8; h <= 18; h++) hours[h] = 0;
    appointments.forEach((a) => {
      const t = a.appointment_time || a.time_slot;
      if (t) {
        const h = parseInt(t.split(":")[0]);
        if (hours[h] !== undefined) hours[h]++;
      }
    });
    return Object.entries(hours).map(([h, value]) => {
      const hr = parseInt(h);
      const ampm = hr >= 12 ? "PM" : "AM";
      return { label: `${hr % 12 || 12}${ampm}`, value };
    });
  }, [appointments]);

  // ─── officer data ──────────────────────────────────────────────────────────

  const officerData = useMemo(() => {
    const map = {};
    appointments.forEach((a) => {
      const name = a.officer_name || "Leena Bansod";
      if (!map[name]) map[name] = { total: 0, completed: 0, pending: 0 };
      map[name].total++;
      if (a.status === "Completed") map[name].completed++;
      else map[name].pending++;
    });
    if (Object.keys(map).length === 0) {
      map["Leena Bansod"] = { total: 0, completed: 0, pending: 0 };
    }
    return Object.entries(map).map(([name, v]) => ({ name, ...v }));
  }, [appointments]);

  // ─── meeting summary ───────────────────────────────────────────────────────

  const meetingStats = useMemo(() => ({
    total: meetings.length,
    completed: meetings.filter((m) => m.status === "Completed").length,
    upcoming: meetings.filter((m) => ["Upcoming", "Scheduled"].includes(m.status)).length,
    cancelled: meetings.filter((m) => m.status === "Cancelled").length,
    googleMeet: meetings.filter((m) => (m.meeting_mode || m.mode || "").toLowerCase().includes("google")).length,
    physical: meetings.filter((m) => (m.meeting_mode || m.mode || "").toLowerCase().includes("physical")).length,
  }), [meetings]);

  // ─── export helpers ────────────────────────────────────────────────────────

  const exportCSV = () => {
    const rows = [
      ["ID", "Citizen", "Purpose", "Date", "Time", "Status", "Officer"],
      ...appointments.map((a) => [
        a.id,
        a.citizen_name || a.applicant_name || "—",
        a.purpose || "—",
        a.appointment_date || "—",
        fmtTime(a.appointment_time || a.time_slot),
        a.status || "—",
        a.officer_name || "Leena Bansod",
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `shabri_report_${today()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const printReport = () => window.print();

  // ─── styles ────────────────────────────────────────────────────────────────

  const card = {
    background: "#fff",
    borderRadius: 16,
    padding: "22px 24px",
    boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
    border: "1px solid #f1f5f9",
  };

  const sectionTitle = {
    fontSize: 14,
    fontWeight: 700,
    color: "#1e293b",
    marginBottom: 18,
    display: "flex",
    alignItems: "center",
    gap: 8,
  };

  const filterBtn = (active) => ({
    padding: "6px 14px",
    borderRadius: 8,
    border: "1.5px solid",
    borderColor: active ? "#3b82f6" : "#e2e8f0",
    background: active ? "#eff6ff" : "#fff",
    color: active ? "#3b82f6" : "#64748b",
    fontWeight: active ? 700 : 500,
    fontSize: 12,
    cursor: "pointer",
    transition: "all 0.15s",
  });

  const th = {
    padding: "10px 14px",
    textAlign: "left",
    fontSize: 11,
    fontWeight: 700,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    background: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
    whiteSpace: "nowrap",
  };

  const td = {
    padding: "10px 14px",
    fontSize: 13,
    color: "#374151",
    borderBottom: "1px solid #f1f5f9",
    verticalAlign: "middle",
  };

  const todayLabel = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // ─── render ────────────────────────────────────────────────────────────────

  return (
    <div
      id="reports-root"
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "28px 28px 48px",
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        color: "#1e293b",
      }}
    >
      {/* ── print styles injected via style tag ── */}
      <style>{`
        @media print {
          body { background:#fff !important; }
          #reports-root { padding: 0 !important; background:#fff !important; }
          .no-print { display:none !important; }
          .print-header { display:block !important; }
          .chart-bar { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { margin: 18mm; }
        }
        .print-header { display:none; }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .kpi-row > * { animation: fadeUp 0.45s ease both; }
      `}</style>

      {/* ── print-only government header ── */}
      <div className="print-header" style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontWeight: 800, fontSize: 16 }}>Government of Maharashtra</div>
        <div style={{ fontSize: 13 }}>
          Maharashtra State Cooperative Tribal Development Corporation Limited
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4 }}>
          Shabri Smart Appointment Management System
        </div>
        <div style={{ fontSize: 12, color: "#555", marginTop: 6 }}>
          Generated On: {new Date().toLocaleDateString("en-IN")} at{" "}
          {new Date().toLocaleTimeString("en-IN")}
        </div>
        <hr style={{ margin: "12px 0" }} />
      </div>

      {/* ── Page Header ── */}
      <div
        className="no-print"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 28,
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#0f172a" }}>
              Reports & Analytics
            </h1>
            <span
              style={{
                background: "#dcfce7",
                color: "#16a34a",
                fontSize: 10,
                fontWeight: 700,
                padding: "3px 9px",
                borderRadius: 20,
                letterSpacing: 0.5,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  background: "#16a34a",
                  borderRadius: "50%",
                  display: "inline-block",
                  animation: "pulse 1.5s infinite",
                }}
              />
              LIVE
            </span>
          </div>
          <div style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>
            Live analytics for appointments and executive meetings · {todayLabel}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          {/* filters */}
          {["today", "week", "month", "custom"].map((f) => (
            <button
              key={f}
              style={filterBtn(filter === f)}
              onClick={() => setFilter(f)}
            >
              {f === "today" ? "Today" : f === "week" ? "This Week" : f === "month" ? "This Month" : "Custom"}
            </button>
          ))}
          {filter === "custom" && (
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              style={{
                padding: "5px 10px",
                borderRadius: 8,
                border: "1.5px solid #e2e8f0",
                fontSize: 12,
                color: "#374151",
              }}
            />
          )}

          {/* export buttons */}
          <button
            onClick={exportCSV}
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              border: "1.5px solid #10b981",
              background: "#f0fdf4",
              color: "#10b981",
              fontWeight: 700,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            ⬇ Export CSV
          </button>
          <button
            onClick={printReport}
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              border: "1.5px solid #3b82f6",
              background: "#eff6ff",
              color: "#3b82f6",
              fontWeight: 700,
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            🖨 Print Report
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: 80, color: "#94a3b8", fontSize: 15 }}>
          Loading analytics…
        </div>
      ) : (
        <>
          {/* ── KPI Cards ── */}
          <div
            className="kpi-row"
            style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 28 }}
          >
            <KpiCard title="Appointments Today" count={total} color="#3b82f6" icon="📋" delay={0} />
            <KpiCard title="Completed" count={completed} sub={`of ${total}`} pctVal={pct(completed, total)} color="#10b981" icon="✅" delay={60} />
            <KpiCard title="Waiting" count={waiting} sub={`of ${total}`} pctVal={pct(waiting, total)} color="#f59e0b" icon="⏳" delay={120} />
            <KpiCard title="No Shows" count={noShow} sub={`of ${total}`} pctVal={pct(noShow, total)} color="#ef4444" icon="🚫" delay={180} />
            <KpiCard title="Reschedule Required" count={reschedule} sub={`of ${total}`} pctVal={pct(reschedule, total)} color="#8b5cf6" icon="🔄" delay={240} />
            <KpiCard title="Executive Meetings" count={totalMeetings} color="#06b6d4" icon="🤝" delay={300} />
          </div>

          {/* ── Row 1: Donut + Purpose ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
            <div style={card}>
              <div style={sectionTitle}>
                <span>🍩</span> Appointment Status Distribution
              </div>
              <DonutChart data={donutData} />
            </div>
            <div style={card}>
              <div style={sectionTitle}>
                <span>🎯</span> Purpose Breakdown
              </div>
              <PurposeBar data={purposeData} />
            </div>
          </div>

          {/* ── Row 2: Hourly + Officer ── */}
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20, marginBottom: 20 }}>
            <div style={card}>
              <div style={sectionTitle}>
                <span>⏰</span> Hourly Appointment Distribution
              </div>
              <HourlyBar data={hourlyData} />
            </div>
            <div style={card}>
              <div style={sectionTitle}>
                <span>👤</span> Officer Performance
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {officerData.map((o) => (
                  <OfficerCard key={o.name} {...o} />
                ))}
              </div>
            </div>
          </div>

          {/* ── Executive Meetings Summary ── */}
          <div style={{ ...card, marginBottom: 20 }}>
            <div style={sectionTitle}>
              <span>📅</span> Executive Meetings Summary
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <MeetingSummaryCard label="Total Meetings" value={meetingStats.total} color="#06b6d4" icon="📋" />
              <MeetingSummaryCard label="Completed" value={meetingStats.completed} color="#10b981" icon="✅" />
              <MeetingSummaryCard label="Upcoming" value={meetingStats.upcoming} color="#3b82f6" icon="🗓" />
              <MeetingSummaryCard label="Cancelled" value={meetingStats.cancelled} color="#ef4444" icon="❌" />
              <MeetingSummaryCard label="Google Meet" value={meetingStats.googleMeet} color="#6366f1" icon="📹" />
              <MeetingSummaryCard label="Physical" value={meetingStats.physical} color="#f59e0b" icon="🏛" />
            </div>
          </div>

          {/* ── Recent Appointments Table ── */}
          <div style={{ ...card, marginBottom: 20 }}>
            <div style={sectionTitle}>
              <span>📋</span> Recent Appointments
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Appt ID", "Citizen", "Purpose", "Date", "Time", "Status", "Officer"].map((h) => (
                      <th key={h} style={th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {appointments.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ ...td, textAlign: "center", color: "#94a3b8", padding: 32 }}>
                        No appointments found for selected period.
                      </td>
                    </tr>
                  ) : (
                    appointments.slice(0, 50).map((a) => (
                      <tr key={a.id} style={{ transition: "background 0.15s" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <td style={td}>
                          <span style={{ fontFamily: "monospace", fontSize: 12, background: "#f1f5f9", padding: "2px 7px", borderRadius: 6 }}>
                            #{String(a.id).padStart(4, "0")}
                          </span>
                        </td>
                        <td style={td}>{a.citizen_name || a.applicant_name || "—"}</td>
                        <td style={td}>{a.purpose || "—"}</td>
                        <td style={td}>{fmtDate(a.appointment_date)}</td>
                        <td style={td}>{fmtTime(a.appointment_time || a.time_slot)}</td>
                        <td style={td}><StatusPill status={a.status || "—"} /></td>
                        <td style={td}>{a.officer_name || "Leena Bansod"}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Executive Meetings Table ── */}
          <div style={card}>
            <div style={sectionTitle}>
              <span>🤝</span> Executive Meetings
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Title", "Meeting With", "Date", "Time", "Mode", "Status"].map((h) => (
                      <th key={h} style={th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {meetings.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ ...td, textAlign: "center", color: "#94a3b8", padding: 32 }}>
                        No meetings found for selected period.
                      </td>
                    </tr>
                  ) : (
                    meetings.map((m) => (
                      <tr key={m.id}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fafc")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <td style={{ ...td, fontWeight: 600, maxWidth: 200 }}>{m.title || m.meeting_title || "—"}</td>
                        <td style={td}>{m.meeting_with || m.participants || "—"}</td>
                        <td style={td}>{fmtDate(m.meeting_date)}</td>
                        <td style={td}>{fmtTime(m.meeting_time || m.start_time)}</td>
                        <td style={td}>
                          <span style={{ fontSize: 12, color: "#374151" }}>
                            {(m.meeting_mode || m.mode || "—").toLowerCase().includes("google") ? "📹 " : "🏛 "}
                            {m.meeting_mode || m.mode || "—"}
                          </span>
                        </td>
                        <td style={td}><StatusPill status={m.status || "—"} /></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── print footer ── */}
          <div className="print-header" style={{ marginTop: 32, borderTop: "1px solid #ccc", paddingTop: 12, textAlign: "center", fontSize: 11, color: "#555" }}>
            Shabri Smart Appointment Management System · Maharashtra State Cooperative Tribal Development Corporation Limited ·{" "}
            {new Date().toLocaleDateString("en-IN")}
          </div>
        </>
      )}
    </div>
  );
}