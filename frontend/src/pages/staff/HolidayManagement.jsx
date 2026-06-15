import { useState } from "react";

const INITIAL_HOLIDAYS = [
  { id: 1, name: "Independence Day", date: "2026-08-15", type: "Full Day", category: "National" },
  { id: 2, name: "Gandhi Jayanti", date: "2026-10-02", type: "Full Day", category: "National" },
  { id: 3, name: "Diwali", date: "2026-11-01", type: "Full Day", category: "Festival" },
  { id: 4, name: "Christmas", date: "2026-12-25", type: "Full Day", category: "Festival" },
  { id: 5, name: "Republic Day", date: "2027-01-26", type: "Full Day", category: "National" },
];

const EMPTY_FORM = { name: "", date: "", type: "Full Day", category: "National" };

const CATEGORY_COLORS = {
  National: { bg: "#EFF6FF", color: "#2563EB" },
  Festival: { bg: "#FEF3C7", color: "#D97706" },
  Regional: { bg: "#ECFDF5", color: "#059669" },
  Office: { bg: "#F5F3FF", color: "#7C3AED" },
};

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

function getDayName(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-IN", { weekday: "long" });
}

export default function HolidayManagement() {
  const [holidays, setHolidays] = useState(INITIAL_HOLIDAYS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editId, setEditId] = useState(null);
  const [errors, setErrors] = useState({});
  const [filterType, setFilterType] = useState("All");

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Holiday name is required";
    if (!form.date) e.date = "Date is required";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    if (editId) {
      setHolidays(prev => prev.map(h => h.id === editId ? { ...form, id: editId } : h));
    } else {
      setHolidays(prev => [...prev, { ...form, id: Date.now() }]);
    }
    setShowForm(false);
    setEditId(null);
    setForm(EMPTY_FORM);
    setErrors({});
  };

  const handleEdit = (h) => {
    setForm({ ...h });
    setEditId(h.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setHolidays(prev => prev.filter(h => h.id !== id));
  };

  const sorted = [...holidays].sort((a, b) => new Date(a.date) - new Date(b.date));
  const filtered = filterType === "All" ? sorted : sorted.filter(h => h.type === filterType);

  const upcoming = sorted.filter(h => new Date(h.date) >= new Date());
  const nextHoliday = upcoming[0];

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.pageHeader}>
        <div>
          <p style={styles.eyebrow}>STAFF PORTAL</p>
          <h1 style={styles.title}>Holiday Management</h1>
          <p style={styles.sub}>Configure office holidays and half-day schedules.</p>
        </div>
        <button onClick={() => { setShowForm(true); setEditId(null); setForm(EMPTY_FORM); setErrors({}); }} style={styles.addBtn}>
          + Add Holiday
        </button>
      </div>

      {/* Stats Row */}
      <div style={styles.statsRow}>
        <StatCard label="Total Holidays" value={holidays.length} icon="📅" color="#2563EB" />
        <StatCard label="Full Days" value={holidays.filter(h => h.type === "Full Day").length} icon="🔴" color="#EF4444" />
        <StatCard label="Half Days" value={holidays.filter(h => h.type === "Half Day").length} icon="🟡" color="#F59E0B" />
        <StatCard label="Upcoming" value={upcoming.length} icon="⏭️" color="#10B981" />
      </div>

      {/* Next Holiday Banner */}
      {nextHoliday && (
        <div style={styles.nextBanner}>
          <div style={styles.nextBannerLeft}>
            <span style={styles.nextBannerIcon}>🎉</span>
            <div>
              <p style={styles.nextBannerLabel}>NEXT HOLIDAY</p>
              <p style={styles.nextBannerName}>{nextHoliday.name}</p>
              <p style={styles.nextBannerDate}>{formatDate(nextHoliday.date)} — {getDayName(nextHoliday.date)}</p>
            </div>
          </div>
          <span style={{ ...styles.typePill, ...(nextHoliday.type === "Full Day" ? styles.fullDayPill : styles.halfDayPill) }}>
            {nextHoliday.type}
          </span>
        </div>
      )}

      {/* Filter */}
      <div style={styles.filterRow}>
        {["All", "Full Day", "Half Day"].map(f => (
          <button key={f} onClick={() => setFilterType(f)}
            style={{ ...styles.filterBtn, background: filterType === f ? "#2563EB" : "#fff", color: filterType === f ? "#fff" : "#64748B", borderColor: filterType === f ? "#2563EB" : "#E2E8F0" }}>
            {f}
          </button>
        ))}
      </div>

      {/* Holiday Cards Grid */}
      <div style={styles.cardsGrid}>
        {filtered.map(h => {
          const catStyle = CATEGORY_COLORS[h.category] || { bg: "#F1F5F9", color: "#64748B" };
          const isPast = new Date(h.date) < new Date();
          return (
            <div key={h.id} style={{ ...styles.holidayCard, opacity: isPast ? 0.65 : 1 }}>
              <div style={styles.cardDateStrip}>
                <span style={styles.cardDay}>{new Date(h.date).getDate()}</span>
                <span style={styles.cardMonth}>{new Date(h.date).toLocaleDateString("en-IN", { month: "short" })}</span>
                <span style={styles.cardYear}>{new Date(h.date).getFullYear()}</span>
              </div>
              <div style={styles.cardBody}>
                <div style={styles.cardTop}>
                  <span style={{ ...styles.catBadge, background: catStyle.bg, color: catStyle.color }}>{h.category}</span>
                  <span style={{ ...styles.typePill, ...(h.type === "Full Day" ? styles.fullDayPill : styles.halfDayPill) }}>{h.type}</span>
                </div>
                <h3 style={styles.cardName}>{h.name}</h3>
                <p style={styles.cardDateText}>{getDayName(h.date)}</p>
                {isPast && <span style={styles.pastBadge}>Past</span>}
                <div style={styles.cardActions}>
                  <button onClick={() => handleEdit(h)} style={styles.editBtn}>✏️ Edit</button>
                  <button onClick={() => handleDelete(h.id)} style={styles.deleteBtn}>🗑 Delete</button>
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={styles.emptyState}>
            <span style={{ fontSize: "36px" }}>📅</span>
            <p style={{ margin: "12px 0 0", color: "#64748B", fontWeight: "500" }}>No holidays found</p>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div style={styles.overlay} onClick={e => { if (e.target === e.currentTarget) setShowForm(false); }}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{editId ? "Edit Holiday" : "Add New Holiday"}</h2>
              <button onClick={() => setShowForm(false)} style={styles.closeBtn}>✕</button>
            </div>
            <div style={styles.modalBody}>
              <FieldWrap label="Holiday Name" error={errors.name} required>
                <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Independence Day"
                  style={{ ...styles.input, borderColor: errors.name ? "#FCA5A5" : "#E2E8F0" }} />
              </FieldWrap>
              <FieldWrap label="Date" error={errors.date} required>
                <input type="date" name="date" value={form.date} onChange={handleChange}
                  style={{ ...styles.input, borderColor: errors.date ? "#FCA5A5" : "#E2E8F0" }} />
              </FieldWrap>
              <FieldWrap label="Holiday Type">
                <div style={{ display: "flex", gap: "12px", marginTop: "4px" }}>
                  {["Full Day", "Half Day"].map(t => (
                    <button key={t} onClick={() => setForm({ ...form, type: t })}
                      style={{ ...styles.typeToggle, background: form.type === t ? (t === "Full Day" ? "#EF4444" : "#F59E0B") : "#F8FAFC", color: form.type === t ? "#fff" : "#374151", border: `1.5px solid ${form.type === t ? "transparent" : "#E2E8F0"}` }}>
                      {t === "Full Day" ? "🔴" : "🟡"} {t}
                    </button>
                  ))}
                </div>
              </FieldWrap>
              <FieldWrap label="Category">
                <select name="category" value={form.category} onChange={handleChange} style={styles.input}>
                  <option>National</option>
                  <option>Festival</option>
                  <option>Regional</option>
                  <option>Office</option>
                </select>
              </FieldWrap>
            </div>
            <div style={styles.modalFooter}>
              <button onClick={() => setShowForm(false)} style={styles.cancelBtn}>Cancel</button>
              <button onClick={handleSave} style={styles.saveBtn}>{editId ? "Save Changes" : "Add Holiday"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div style={{ background: "#fff", borderRadius: "14px", padding: "20px 24px", flex: 1, minWidth: "130px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", borderTop: `4px solid ${color}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
        <span style={{ fontSize: "20px" }}>{icon}</span>
      </div>
      <p style={{ margin: "0 0 4px", fontSize: "11px", color: "#94A3B8", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</p>
      <p style={{ margin: 0, fontSize: "26px", fontWeight: "800", color }}>{value}</p>
    </div>
  );
}

function FieldWrap({ label, error, required, children }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={{ display: "block", marginBottom: "7px", fontSize: "13px", fontWeight: "600", color: "#374151" }}>
        {label} {required && <span style={{ color: "#EF4444" }}>*</span>}
      </label>
      {children}
      {error && <p style={{ margin: "4px 0 0", color: "#DC2626", fontSize: "12px" }}>{error}</p>}
    </div>
  );
}

const styles = {
  page: { padding: "36px 40px", background: "#F8FAFC", minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif" },
  pageHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px", flexWrap: "wrap", gap: "16px" },
  eyebrow: { margin: "0 0 6px", fontSize: "11px", fontWeight: "700", letterSpacing: "2px", color: "#2563EB" },
  title: { margin: "0 0 4px", fontSize: "28px", fontWeight: "800", color: "#111827" },
  sub: { margin: 0, fontSize: "14px", color: "#64748B" },
  addBtn: { background: "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "#fff", border: "none", padding: "12px 20px", borderRadius: "12px", fontWeight: "700", fontSize: "14px", cursor: "pointer" },
  statsRow: { display: "flex", gap: "16px", marginBottom: "20px", flexWrap: "wrap" },
  nextBanner: { display: "flex", justifyContent: "space-between", alignItems: "center", background: "linear-gradient(135deg,#1E3A8A,#2563EB)", borderRadius: "16px", padding: "20px 28px", marginBottom: "24px", flexWrap: "wrap", gap: "12px" },
  nextBannerLeft: { display: "flex", gap: "16px", alignItems: "center" },
  nextBannerIcon: { fontSize: "32px" },
  nextBannerLabel: { margin: "0 0 4px", fontSize: "10px", fontWeight: "700", letterSpacing: "2px", color: "rgba(255,255,255,0.6)" },
  nextBannerName: { margin: "0 0 2px", fontSize: "18px", fontWeight: "800", color: "#fff" },
  nextBannerDate: { margin: 0, fontSize: "13px", color: "rgba(255,255,255,0.75)" },
  filterRow: { display: "flex", gap: "8px", marginBottom: "20px" },
  filterBtn: { padding: "8px 18px", borderRadius: "20px", border: "1.5px solid", fontSize: "13px", fontWeight: "600", cursor: "pointer" },
  cardsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" },
  holidayCard: { background: "#fff", borderRadius: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)", overflow: "hidden", display: "flex" },
  cardDateStrip: { width: "70px", background: "linear-gradient(160deg,#1E3A8A,#2563EB)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "16px 8px", flexShrink: 0 },
  cardDay: { color: "#fff", fontSize: "26px", fontWeight: "900", lineHeight: 1 },
  cardMonth: { color: "rgba(255,255,255,0.75)", fontSize: "12px", fontWeight: "700", textTransform: "uppercase" },
  cardYear: { color: "rgba(255,255,255,0.5)", fontSize: "10px", marginTop: "2px" },
  cardBody: { flex: 1, padding: "16px 18px" },
  cardTop: { display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px", flexWrap: "wrap" },
  catBadge: { fontSize: "11px", fontWeight: "700", padding: "3px 9px", borderRadius: "20px" },
  typePill: { fontSize: "11px", fontWeight: "700", padding: "3px 9px", borderRadius: "20px" },
  fullDayPill: { background: "#FEF2F2", color: "#DC2626" },
  halfDayPill: { background: "#FEF3C7", color: "#D97706" },
  cardName: { margin: "0 0 3px", fontSize: "15px", fontWeight: "700", color: "#111827" },
  cardDateText: { margin: "0 0 8px", fontSize: "12px", color: "#94A3B8" },
  pastBadge: { display: "inline-block", background: "#F1F5F9", color: "#94A3B8", fontSize: "10px", fontWeight: "700", padding: "2px 8px", borderRadius: "10px", marginBottom: "8px" },
  cardActions: { display: "flex", gap: "8px" },
  editBtn: { background: "#F8FAFC", color: "#374151", border: "1px solid #E2E8F0", padding: "6px 12px", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: "600" },
  deleteBtn: { background: "#FEF2F2", color: "#DC2626", border: "1px solid #FECACA", padding: "6px 12px", borderRadius: "8px", cursor: "pointer", fontSize: "12px", fontWeight: "600" },
  emptyState: { gridColumn: "1/-1", textAlign: "center", padding: "60px 0" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" },
  modal: { background: "#fff", borderRadius: "20px", width: "100%", maxWidth: "480px", overflow: "hidden" },
  modalHeader: { padding: "24px 28px 16px", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" },
  modalTitle: { margin: 0, fontSize: "20px", fontWeight: "700", color: "#111827" },
  closeBtn: { background: "#F1F5F9", border: "none", borderRadius: "8px", padding: "6px 10px", cursor: "pointer", fontSize: "14px", color: "#64748B" },
  modalBody: { padding: "24px 28px" },
  modalFooter: { padding: "16px 28px 24px", borderTop: "1px solid #F1F5F9", display: "flex", justifyContent: "flex-end", gap: "12px" },
  input: { width: "100%", padding: "11px 14px", border: "1.5px solid #E2E8F0", borderRadius: "10px", fontSize: "14px", background: "#F8FAFC", color: "#111827", outline: "none", boxSizing: "border-box" },
  typeToggle: { flex: 1, padding: "10px", borderRadius: "10px", cursor: "pointer", fontSize: "13px", fontWeight: "600" },
  cancelBtn: { background: "#F1F5F9", color: "#374151", border: "none", padding: "12px 20px", borderRadius: "10px", cursor: "pointer", fontWeight: "600", fontSize: "14px" },
  saveBtn: { background: "linear-gradient(135deg,#2563EB,#1d4ed8)", color: "#fff", border: "none", padding: "12px 24px", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "14px" },
};