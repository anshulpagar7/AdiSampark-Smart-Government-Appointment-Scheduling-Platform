import { useState, useEffect, useCallback, useMemo } from "react";
import { supabase } from "../../lib/supabase";
import { useRealtime } from "../../hooks/useRealtime";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toDateString(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function getWeekRange() {
  const now = new Date(); const day = now.getDay();
  const mon = new Date(now); mon.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
  return { start: toDateString(mon), end: toDateString(now) };
}
function getMonthRange() {
  const now = new Date();
  return { start: `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-01`, end: toDateString(now) };
}
function getRange(filter, custom) {
  if (filter === "week")  return getWeekRange();
  if (filter === "month") return getMonthRange();
  if (filter === "custom" && custom) return { start: custom, end: custom };
  const t = toDateString(new Date()); return { start: t, end: t };
}
function fmtTime(t) {
  if (!t) return "—";
  const [h, m] = t.split(":"); const hr = parseInt(h);
  return `${hr % 12 || 12}:${m} ${hr >= 12 ? "PM" : "AM"}`;
}
function fmtDate(d) {
  if (!d) return "—";
  return new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" });
}
function pct(n, total) { return total === 0 ? 0 : Math.round((n / total) * 100); }

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_CFG = {
  Completed:             { bg:"#ECFDF5", color:"#059669", dot:"#10B981" },
  Waiting:               { bg:"#FFFBEB", color:"#D97706", dot:"#F59E0B" },
  "No Show":             { bg:"#FEF2F2", color:"#DC2626", dot:"#EF4444" },
  "Reschedule Required": { bg:"#F5F3FF", color:"#7C3AED", dot:"#A855F7" },
  Approved:              { bg:"#EFF6FF", color:"#2563EB", dot:"#3B82F6" },
  "In Cabin":            { bg:"#DBEAFE", color:"#1D4ED8", dot:"#2563EB"  },
  Cancelled:             { bg:"#F1F5F9", color:"#64748B", dot:"#94A3B8" },
  Scheduled:             { bg:"#EFF6FF", color:"#2563EB", dot:"#3B82F6" },
  Upcoming:              { bg:"#F0FDFA", color:"#0D9488", dot:"#14B8A6" },
};
const PURPOSE_COLORS = ["#2563EB","#10B981","#F59E0B","#7C3AED","#EF4444","#0D9488","#EC4899","#F97316"];

// ─── Print — opens new window so sidebar is NEVER shown ──────────────────────

function openPrintWindow(appointments, meetings, dateLabel) {
  const apptRows = appointments.map(a => `<tr>
    <td>${a.appointment_id ?? "—"}</td><td>${a.citizen_name ?? "—"}</td>
    <td>${a.mobile ?? "—"}</td><td>${a.purpose ?? "—"}</td>
    <td>${fmtDate(a.appointment_date)}</td><td>${fmtTime(a.appointment_time)}</td>
    <td>${a.status ?? "—"}</td><td>${a.officer_name ?? "—"}</td>
  </tr>`).join("");
  const mtgRows = meetings.map(m => `<tr>
    <td>${m.title ?? "—"}</td><td>${m.meeting_with ?? m.participants ?? "—"}</td>
    <td>${fmtDate(m.meeting_date)}</td><td>${fmtTime(m.meeting_time ?? m.start_time)}</td>
    <td>${m.meeting_mode ?? m.mode ?? "—"}</td><td>${m.status ?? "—"}</td>
  </tr>`).join("");
  const html = `<html><head><title>Shabri Report</title><style>
    body{font-family:Arial,sans-serif;padding:28px;color:#111;font-size:12px}
    .hdr{text-align:center;border-bottom:2px solid #1E3A8A;padding-bottom:14px;margin-bottom:18px}
    .hdr h2{margin:0 0 3px;font-size:15px;color:#1E3A8A}
    .hdr p{margin:2px 0;font-size:12px;color:#444}
    .hdr .main{font-size:14px;font-weight:700;color:#111;margin-top:7px}
    .meta{font-size:11px;color:#555;margin-bottom:16px}
    h3{font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#2563EB;
      margin:0 0 8px;border-bottom:1px solid #E2E8F0;padding-bottom:5px}
    .sec{margin-bottom:22px}
    table{width:100%;border-collapse:collapse}
    th{background:#1E3A8A;color:#fff;padding:8px 10px;text-align:left;font-size:10px;text-transform:uppercase;letter-spacing:.5px}
    td{padding:7px 10px;border-bottom:1px solid #E5E7EB}
    tr:nth-child(even) td{background:#F8FAFC}
    .footer{margin-top:24px;border-top:1px solid #ddd;padding-top:10px;text-align:center;font-size:10px;color:#888}
  </style></head><body>
  <div class="hdr">
    <h2>Government of Maharashtra</h2>
    <p>Maharashtra State Cooperative Tribal Development Corporation Limited</p>
    <p class="main">Shabri Smart Appointment Management System</p>
    <p>Reports &amp; Analytics — ${dateLabel}</p>
  </div>
  <p class="meta">Generated: ${new Date().toLocaleString("en-IN")} &nbsp;|&nbsp; Appointments: ${appointments.length} &nbsp;|&nbsp; Meetings: ${meetings.length}</p>
  <div class="sec"><h3>Appointments</h3>
  <table><thead><tr><th>Token ID</th><th>Citizen</th><th>Mobile</th><th>Purpose</th><th>Date</th><th>Time</th><th>Status</th><th>Officer</th></tr></thead>
  <tbody>${apptRows || "<tr><td colspan='8' style='text-align:center;color:#888;padding:14px'>No appointments</td></tr>"}</tbody></table></div>
  <div class="sec"><h3>Executive Meetings</h3>
  <table><thead><tr><th>Title</th><th>Meeting With</th><th>Date</th><th>Time</th><th>Mode</th><th>Status</th></tr></thead>
  <tbody>${mtgRows || "<tr><td colspan='6' style='text-align:center;color:#888;padding:14px'>No meetings</td></tr>"}</tbody></table></div>
  <div class="footer">Shabri Smart Appointment Management System &nbsp;·&nbsp; Maharashtra State Cooperative Tribal Development Corporation Limited</div>
  </body></html>`;
  const win = window.open("", "_blank");
  win.document.write(html); win.document.close(); win.print();
}

// ─── CSV Export ───────────────────────────────────────────────────────────────

function exportCSV(appointments, meetings) {
  const rows = [
    ["APPOINTMENTS"],
    ["Token ID","Citizen","Mobile","Purpose","Date","Time","Status","Officer"],
    ...appointments.map(a => [a.appointment_id??"",a.citizen_name??"",a.mobile??"",a.purpose??"",a.appointment_date??"",a.appointment_time??"",a.status??"",a.officer_name??""]),
    [],
    ["EXECUTIVE MEETINGS"],
    ["Title","Meeting With","Date","Time","Mode","Status"],
    ...meetings.map(m => [m.title??"",m.meeting_with??m.participants??"",m.meeting_date??"",m.meeting_time??m.start_time??"",m.meeting_mode??m.mode??"",m.status??""]),
  ].map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
  const blob = new Blob([rows], { type:"text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = `shabri_report_${toDateString(new Date())}.csv`;
  a.click(); URL.revokeObjectURL(url);
}

// ─── Reusable UI pieces ───────────────────────────────────────────────────────

function StatusPill({ status }) {
  const cfg = STATUS_CFG[status] || { bg:"#F1F5F9", color:"#64748B", dot:"#94A3B8" };
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, background:cfg.bg, color:cfg.color,
      padding:"4px 11px", borderRadius:20, fontSize:11, fontWeight:700, whiteSpace:"nowrap" }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:cfg.dot, flexShrink:0 }} />
      {status}
    </span>
  );
}

function KpiCard({ label, value, sub, pctVal, icon, color, bg }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background:"#fff", borderRadius:16, padding:"22px 24px",
        boxShadow: hov ? "0 8px 28px rgba(0,0,0,0.10)" : "0 1px 3px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.04)",
        transform: hov ? "translateY(-3px)" : "none", transition:"transform 0.2s,box-shadow 0.2s", cursor:"default" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
        <div>
          <p style={{ margin:"0 0 5px", fontSize:12, color:"#64748B", fontWeight:500 }}>{label}</p>
          <div style={{ fontSize:38, fontWeight:800, color, lineHeight:1 }}>{value}</div>
          {sub && (
            <p style={{ margin:"5px 0 0", fontSize:12, color:"#94A3B8" }}>
              {sub}
              {pctVal !== undefined && (
                <span style={{ marginLeft:6, background:bg, color, borderRadius:6, padding:"1px 7px", fontWeight:700, fontSize:11 }}>{pctVal}%</span>
              )}
            </p>
          )}
        </div>
        <div style={{ width:46, height:46, borderRadius:12, background:bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>{icon}</div>
      </div>
      <div style={{ height:4, borderRadius:4, background:bg, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${pctVal ?? 0}%`, background:color, borderRadius:4, transition:"width 0.8s ease" }} />
      </div>
    </div>
  );
}

function DonutChart({ data, total }) {
  let cum = 0;
  const segs = data.map(d => { const frac = total === 0 ? 0 : (d.value/total)*360; const s=cum; cum+=frac; return {...d,start:s,frac}; });
  const grad = segs.filter(s => s.frac > 0).map(s => `${s.color} ${s.start}deg ${s.start+s.frac}deg`).join(", ");
  return (
    <div style={{ display:"flex", gap:28, alignItems:"center", flexWrap:"wrap" }}>
      <div style={{ position:"relative", width:144, height:144, borderRadius:"50%", flexShrink:0,
        background: total===0 ? "#E2E8F0" : `conic-gradient(${grad})`, boxShadow:"0 4px 20px rgba(0,0,0,0.08)" }}>
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)",
          width:82, height:82, borderRadius:"50%", background:"#fff",
          display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
          <div style={{ fontSize:24, fontWeight:800, color:"#111827", lineHeight:1 }}>{total}</div>
          <div style={{ fontSize:9, color:"#94A3B8", fontWeight:700, letterSpacing:0.5, textTransform:"uppercase" }}>Total</div>
        </div>
      </div>
      <div style={{ flex:1, display:"flex", flexDirection:"column", gap:10, minWidth:140 }}>
        {data.map(d => (
          <div key={d.label} style={{ display:"flex", alignItems:"center", gap:8 }}>
            <div style={{ width:10, height:10, borderRadius:3, background:d.color, flexShrink:0 }} />
            <span style={{ fontSize:12, color:"#374151", flex:1 }}>{d.label}</span>
            <span style={{ fontSize:13, fontWeight:700, color:"#111827", minWidth:26, textAlign:"right" }}>{d.value}</span>
            <span style={{ fontSize:11, color:"#94A3B8", minWidth:34, textAlign:"right" }}>{pct(d.value,total)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PurposeBar({ data }) {
  const max = Math.max(...data.map(d => d.value), 1);
  if (data.length === 0) return <p style={{ fontSize:13, color:"#94A3B8", margin:0, textAlign:"center" }}>No data</p>;
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      {data.map((d,i) => (
        <div key={d.label}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
            <span style={{ fontSize:13, color:"#374151", fontWeight:500 }}>{d.label}</span>
            <span style={{ fontSize:13, fontWeight:700, color:"#111827" }}>{d.value}</span>
          </div>
          <div style={{ height:8, background:"#F1F5F9", borderRadius:8, overflow:"hidden" }}>
            <div style={{ height:"100%", borderRadius:8, transition:"width 0.9s ease",
              width:`${(d.value/max)*100}%`, background:PURPOSE_COLORS[i % PURPOSE_COLORS.length] }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function HourlyBar({ data }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div style={{ display:"flex", alignItems:"flex-end", gap:8, height:128, overflowX:"auto", paddingBottom:4 }}>
      {data.map(d => (
        <div key={d.label} style={{ display:"flex", flexDirection:"column", alignItems:"center", flex:"0 0 auto" }}>
          <div style={{ fontSize:10, color:"#94A3B8", marginBottom:3, fontWeight:600, minWidth:14, textAlign:"center" }}>
            {d.value > 0 ? d.value : ""}
          </div>
          <div style={{ width:32, borderRadius:"6px 6px 0 0", transition:"height 0.9s ease",
            height: d.value ? `${(d.value/max)*100}%` : 3, minHeight: d.value ? 6 : 3,
            background: d.value ? "linear-gradient(180deg,#2563EB 0%,#1E3A8A 100%)" : "#E2E8F0",
            boxShadow: d.value ? "0 2px 8px rgba(37,99,235,0.22)" : "none" }} />
          <div style={{ fontSize:9, color:"#94A3B8", marginTop:5, whiteSpace:"nowrap", fontWeight:600 }}>{d.label}</div>
        </div>
      ))}
    </div>
  );
}

function MeetingSummaryCards({ stats }) {
  const cards = [
    { label:"Total",       value:stats.total,     color:"#2563EB", bg:"#EFF6FF", icon:"📋" },
    { label:"Completed",   value:stats.completed, color:"#059669", bg:"#ECFDF5", icon:"✅" },
    { label:"Upcoming",    value:stats.upcoming,  color:"#0D9488", bg:"#F0FDFA", icon:"🗓" },
    { label:"Cancelled",   value:stats.cancelled, color:"#DC2626", bg:"#FEF2F2", icon:"❌" },
    { label:"Google Meet", value:stats.google,    color:"#7C3AED", bg:"#F5F3FF", icon:"📹" },
    { label:"Physical",    value:stats.physical,  color:"#D97706", bg:"#FFFBEB", icon:"🏛" },
  ];
  return (
    <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
      {cards.map(c => {
        const [hov, setHov] = useState(false);
        return (
          <div key={c.label}
            onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
            style={{ flex:"1 1 80px", background:c.bg, borderRadius:14, padding:"14px 10px",
              textAlign:"center", border:`1.5px solid ${c.color}20`,
              transform: hov ? "translateY(-3px)" : "none",
              boxShadow: hov ? `0 8px 20px ${c.color}18` : "0 1px 4px rgba(0,0,0,0.04)",
              transition:"transform 0.2s,box-shadow 0.2s" }}>
            <div style={{ fontSize:20, marginBottom:5 }}>{c.icon}</div>
            <div style={{ fontSize:26, fontWeight:800, color:c.color, lineHeight:1 }}>{c.value}</div>
            <div style={{ fontSize:10, color:"#64748B", fontWeight:600, marginTop:4 }}>{c.label}</div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Reports() {
  const [appointments, setAppointments] = useState([]);
  const [meetings,     setMeetings]     = useState([]);
  const [filter,       setFilter]       = useState("today");
  const [customDate,   setCustomDate]   = useState("");
  const [loading,      setLoading]      = useState(true);

  const { start, end } = useMemo(() => getRange(filter, customDate), [filter, customDate]);

  const dateLabel = useMemo(() => {
    if (filter === "today")  return new Date().toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"long", year:"numeric" });
    if (filter === "week")   return `${fmtDate(start)} – ${fmtDate(end)}`;
    if (filter === "month")  return new Date().toLocaleDateString("en-IN", { month:"long", year:"numeric" });
    if (filter === "custom" && customDate) return fmtDate(customDate);
    return "—";
  }, [filter, start, end, customDate]);

  const fetchAppointments = useCallback(async () => {
    const { data } = await supabase.from("appointments").select("*")
      .gte("appointment_date", start).lte("appointment_date", end)
      .order("appointment_date", { ascending:false });
    setAppointments(data || []); setLoading(false);
  }, [start, end]);

  const fetchMeetings = useCallback(async () => {
    const { data } = await supabase.from("executive_meetings").select("*")
      .gte("meeting_date", start).lte("meeting_date", end)
      .order("meeting_date", { ascending:false });
    setMeetings(data || []);
  }, [start, end]);

  useEffect(() => { setLoading(true); fetchAppointments(); fetchMeetings(); }, [fetchAppointments, fetchMeetings]);
  useRealtime({ appointments: fetchAppointments, executive_meetings: fetchMeetings });

  const total      = appointments.length;
  const completed  = useMemo(() => appointments.filter(a => a.status === "Completed").length,             [appointments]);
  const waiting    = useMemo(() => appointments.filter(a => a.status === "Waiting").length,               [appointments]);
  const noShow     = useMemo(() => appointments.filter(a => a.status === "No Show").length,               [appointments]);
  const reschedule = useMemo(() => appointments.filter(a => a.status === "Reschedule Required").length,   [appointments]);

  const donutData = useMemo(() => [
    { label:"Completed",           value:completed,  color:"#10B981" },
    { label:"Waiting",             value:waiting,    color:"#F59E0B" },
    { label:"No Show",             value:noShow,     color:"#EF4444" },
    { label:"Reschedule Required", value:reschedule, color:"#7C3AED" },
    { label:"Approved / In Cabin", value:appointments.filter(a => ["Approved","In Cabin"].includes(a.status)).length, color:"#2563EB" },
  ], [appointments, completed, waiting, noShow, reschedule]);

  const purposeData = useMemo(() => {
    const map = {};
    appointments.forEach(a => { const p = a.purpose || "Other"; map[p] = (map[p]||0)+1; });
    return Object.entries(map).sort((a,b) => b[1]-a[1]).map(([label,value]) => ({ label, value }));
  }, [appointments]);

  const hourlyData = useMemo(() => {
    const hrs = {}; for (let h=8;h<=18;h++) hrs[h]=0;
    appointments.forEach(a => {
      const t = a.appointment_time; if (!t) return;
      const h = parseInt(t.split(":")[0]); if (hrs[h]!==undefined) hrs[h]++;
    });
    return Object.entries(hrs).map(([h,value]) => { const hr=parseInt(h); return { label:`${hr%12||12}${hr>=12?"PM":"AM"}`, value }; });
  }, [appointments]);

  const meetingStats = useMemo(() => ({
    total:    meetings.length,
    completed:meetings.filter(m => m.status==="Completed").length,
    upcoming: meetings.filter(m => ["Upcoming","Scheduled"].includes(m.status)).length,
    cancelled:meetings.filter(m => m.status==="Cancelled").length,
    google:   meetings.filter(m => (m.meeting_mode||m.mode||"").toLowerCase().includes("google")).length,
    physical: meetings.filter(m => (m.meeting_mode||m.mode||"").toLowerCase().includes("physical")).length,
  }), [meetings]);

  const S = styles;

  return (
    <div style={S.page}>

      {/* Header */}
      <div style={S.pageHeader}>
        <div>
          <p style={S.eyebrow}>REPORTS &amp; ANALYTICS</p>
          <h1 style={S.title}>Reports &amp; Analytics</h1>
          <p style={S.sub}>
            Live analytics for appointments and executive meetings &nbsp;&middot;&nbsp;
            <span style={{ fontWeight:600, color:"#374151" }}>{dateLabel}</span>
          </p>
        </div>
        <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
          <div style={S.liveBadge}><span style={S.pulseDot} /><span style={{ fontSize:13, color:"#059669", fontWeight:600 }}>Live</span></div>
          {[["today","Today"],["week","This Week"],["month","This Month"],["custom","Custom"]].map(([f,lbl]) => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ ...S.filterBtn, ...(filter===f ? S.filterActive : {}) }}>{lbl}</button>
          ))}
          {filter === "custom" && (
            <input type="date" value={customDate} onChange={e => setCustomDate(e.target.value)} style={S.datePicker} />
          )}
          <button onClick={() => exportCSV(appointments, meetings)} style={S.actionBtn}>&#8595; CSV</button>
          <button onClick={() => openPrintWindow(appointments, meetings, dateLabel)} style={S.actionBtn}>&#128424; Print</button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign:"center", padding:80, color:"#94A3B8", fontSize:15 }}>Loading analytics…</div>
      ) : (<>

        {/* KPI row */}
        <div style={S.kpiRow}>
          <KpiCard label="Appointments" value={total}         icon="📋" color="#2563EB" bg="#EFF6FF" pctVal={100} />
          <KpiCard label="Completed"    value={completed}     icon="✅" color="#059669" bg="#ECFDF5" sub={`of ${total}`} pctVal={pct(completed,total)} />
          <KpiCard label="Waiting"      value={waiting}       icon="⏳" color="#D97706" bg="#FFFBEB" sub={`of ${total}`} pctVal={pct(waiting,total)} />
          <KpiCard label="No Shows"     value={noShow}        icon="🚫" color="#DC2626" bg="#FEF2F2" sub={`of ${total}`} pctVal={pct(noShow,total)} />
          <KpiCard label="Reschedule"   value={reschedule}    icon="🔄" color="#7C3AED" bg="#F5F3FF" sub={`of ${total}`} pctVal={pct(reschedule,total)} />
          <KpiCard label="Exec Meetings"value={meetings.length} icon="🤝" color="#0D9488" bg="#F0FDFA" pctVal={100} />
        </div>

        {/* Charts row 1 */}
        <div style={S.grid2}>
          <div style={S.card}>
            <p style={S.cardEyebrow}>&#127369; APPOINTMENT STATUS DISTRIBUTION</p>
            <div style={{ marginTop:20 }}><DonutChart data={donutData} total={total} /></div>
          </div>
          <div style={S.card}>
            <p style={S.cardEyebrow}>&#127919; PURPOSE BREAKDOWN</p>
            <div style={{ marginTop:20 }}><PurposeBar data={purposeData} /></div>
          </div>
        </div>

        {/* Charts row 2 */}
        <div style={S.grid2}>
          <div style={S.card}>
            <p style={S.cardEyebrow}>&#9200; HOURLY APPOINTMENT DISTRIBUTION</p>
            <div style={{ marginTop:20 }}><HourlyBar data={hourlyData} /></div>
          </div>
          <div style={S.card}>
            <p style={S.cardEyebrow}>&#128197; EXECUTIVE MEETINGS SUMMARY</p>
            <div style={{ marginTop:20 }}><MeetingSummaryCards stats={meetingStats} /></div>
          </div>
        </div>

        {/* Appointments table */}
        <div style={{ ...S.card, marginBottom:20 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <p style={S.cardEyebrow}>&#128203; RECENT APPOINTMENTS</p>
            <span style={S.countBadge}>{appointments.length} total</span>
          </div>
          <div style={{ overflowX:"auto", marginTop:16 }}>
            <table style={S.table}>
              <thead><tr style={{ background:"#F8FAFC" }}>
                {["Token ID","Citizen","Mobile","Purpose","Date","Time","Status","Officer"].map(h => <th key={h} style={S.th}>{h}</th>)}
              </tr></thead>
              <tbody>
                {appointments.length === 0
                  ? <tr><td colSpan={8} style={{ padding:40, textAlign:"center", color:"#94A3B8", fontSize:13 }}>No appointments found for the selected period.</td></tr>
                  : appointments.slice(0,60).map(a => (
                    <tr key={a.id} style={S.tr}
                      onMouseEnter={e => e.currentTarget.style.background="#F8FAFC"}
                      onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                      <td style={S.td}><span style={S.tokenId}>{a.appointment_id ?? `#${String(a.id).padStart(4,"0")}`}</span></td>
                      <td style={S.td}>
                        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                          <div style={S.avatar}>{(a.citizen_name||"?")[0]}</div>
                          <span style={{ fontWeight:600, color:"#111827", fontSize:13 }}>{a.citizen_name ?? "—"}</span>
                        </div>
                      </td>
                      <td style={S.td}><span style={S.mono}>{a.mobile ?? "—"}</span></td>
                      <td style={S.td}><span style={S.purposeTag}>{a.purpose ?? "—"}</span></td>
                      <td style={S.td}><span style={{ fontSize:12, color:"#374151" }}>{fmtDate(a.appointment_date)}</span></td>
                      <td style={S.td}><span style={S.mono}>{fmtTime(a.appointment_time)}</span></td>
                      <td style={S.td}><StatusPill status={a.status ?? "—"} /></td>
                      <td style={S.td}><span style={{ fontSize:12, color:"#64748B" }}>{a.officer_name ?? "—"}</span></td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>

        {/* Meetings table */}
        <div style={S.card}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <p style={S.cardEyebrow}>&#129309; EXECUTIVE MEETINGS</p>
            <span style={S.countBadge}>{meetings.length} total</span>
          </div>
          <div style={{ overflowX:"auto", marginTop:16 }}>
            <table style={S.table}>
              <thead><tr style={{ background:"#F8FAFC" }}>
                {["Title","Meeting With","Date","Time","Mode","Status"].map(h => <th key={h} style={S.th}>{h}</th>)}
              </tr></thead>
              <tbody>
                {meetings.length === 0
                  ? <tr><td colSpan={6} style={{ padding:40, textAlign:"center", color:"#94A3B8", fontSize:13 }}>No meetings found for the selected period.</td></tr>
                  : meetings.map(m => {
                    const mode = m.meeting_mode || m.mode || "—";
                    const isGoogle = mode.toLowerCase().includes("google");
                    return (
                      <tr key={m.id} style={S.tr}
                        onMouseEnter={e => e.currentTarget.style.background="#F8FAFC"}
                        onMouseLeave={e => e.currentTarget.style.background="transparent"}>
                        <td style={S.td}><span style={{ fontWeight:600, color:"#111827", fontSize:13 }}>{m.title ?? "—"}</span></td>
                        <td style={S.td}><span style={{ fontSize:13, color:"#374151" }}>{m.meeting_with ?? m.participants ?? "—"}</span></td>
                        <td style={S.td}><span style={{ fontSize:12, color:"#374151" }}>{fmtDate(m.meeting_date)}</span></td>
                        <td style={S.td}><span style={S.mono}>{fmtTime(m.meeting_time ?? m.start_time)}</span></td>
                        <td style={S.td}>
                          <span style={{ fontSize:12, color:"#374151", display:"flex", alignItems:"center", gap:5 }}>
                            {isGoogle ? "📹" : "🏛"} {mode}
                          </span>
                        </td>
                        <td style={S.td}><StatusPill status={m.status ?? "—"} /></td>
                      </tr>
                    );
                  })
                }
              </tbody>
            </table>
          </div>
        </div>

      </>)}
    </div>
  );
}

// ─── Styles — matching project tokens exactly ─────────────────────────────────

const styles = {
  page:        { padding:"36px 40px", background:"#F8FAFC", minHeight:"100vh", fontFamily:"'Segoe UI',system-ui,sans-serif" },
  pageHeader:  { display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:28, flexWrap:"wrap", gap:16 },
  eyebrow:     { margin:"0 0 6px", fontSize:11, fontWeight:700, letterSpacing:"2px", color:"#2563EB" },
  title:       { margin:"0 0 6px", fontSize:28, fontWeight:800, color:"#111827" },
  sub:         { margin:0, fontSize:14, color:"#64748B" },
  liveBadge:   { display:"flex", alignItems:"center", gap:8, background:"#ECFDF5", border:"1px solid #A7F3D0", borderRadius:20, padding:"7px 14px" },
  pulseDot:    { width:8, height:8, borderRadius:"50%", background:"#10B981", display:"inline-block" },
  filterBtn:   { background:"#fff", border:"1.5px solid #E2E8F0", borderRadius:10, padding:"8px 14px", fontSize:12, fontWeight:600, color:"#374151", cursor:"pointer", transition:"all 0.15s" },
  filterActive:{ background:"#EFF6FF", borderColor:"#2563EB", color:"#2563EB" },
  datePicker:  { padding:"8px 12px", border:"1.5px solid #E2E8F0", borderRadius:10, fontSize:12, color:"#374151", outline:"none" },
  actionBtn:   { background:"#fff", border:"1.5px solid #E2E8F0", borderRadius:10, padding:"8px 14px", fontSize:12, fontWeight:600, color:"#374151", cursor:"pointer" },
  kpiRow:      { display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(168px,1fr))", gap:18, marginBottom:22 },
  grid2:       { display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:20 },
  card:        { background:"#fff", borderRadius:16, padding:"24px", boxShadow:"0 1px 3px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.04)", marginBottom:20 },
  cardEyebrow: { margin:0, fontSize:11, fontWeight:700, letterSpacing:"1.5px", color:"#94A3B8" },
  countBadge:  { background:"#F1F5F9", color:"#64748B", fontSize:12, fontWeight:600, padding:"4px 10px", borderRadius:20 },
  table:       { width:"100%", borderCollapse:"collapse" },
  th:          { padding:"11px 16px", textAlign:"left", fontSize:11, fontWeight:700, color:"#94A3B8", letterSpacing:"0.8px", textTransform:"uppercase", borderBottom:"1px solid #E2E8F0" },
  tr:          { borderBottom:"1px solid #F1F5F9", transition:"background 0.1s" },
  td:          { padding:"13px 16px", fontSize:13, color:"#374151", verticalAlign:"middle" },
  tokenId:     { fontFamily:"monospace", fontWeight:700, fontSize:12, color:"#2563EB", background:"#EFF6FF", padding:"3px 8px", borderRadius:6 },
  avatar:      { width:30, height:30, borderRadius:8, background:"linear-gradient(135deg,#2563EB,#1E3A8A)", color:"#fff", fontWeight:700, fontSize:12, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 },
  mono:        { fontFamily:"monospace", fontSize:12, color:"#64748B" },
  purposeTag:  { background:"#EFF6FF", color:"#2563EB", fontSize:11, fontWeight:600, padding:"3px 9px", borderRadius:6 },
};