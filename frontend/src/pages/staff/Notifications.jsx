import { useState } from "react";

const TEMPLATES = [
  {
    id: "confirmation",
    type: "Appointment Confirmation",
    icon: "✅",
    channel: "WhatsApp",
    color: "#10B981",
    bg: "#ECFDF5",
    template: "Hello {citizen_name},\n\nYour appointment with {officer_name} (Managing Director's Office) has been confirmed.\n\n📋 Token: {token_id}\n🕐 Time: {time}\n📅 Date: {date}\n📍 Venue: Shabri Office\n\nPlease arrive 10 minutes before your scheduled time.\n\nFor any queries, contact: 1800-XXX-XXXX\n\n— Maharashtra State Cooperative Tribal Development Corporation Ltd.",
    variables: ["citizen_name", "officer_name", "token_id", "time", "date"],
  },
  {
    id: "reminder",
    type: "Appointment Reminder",
    icon: "🔔",
    channel: "WhatsApp",
    color: "#2563EB",
    bg: "#EFF6FF",
    template: "Hello {citizen_name},\n\nThis is a reminder for your appointment TOMORROW.\n\n📋 Token: {token_id}\n🕐 Time: {time}\n👤 Officer: {officer_name}\n\nPlease carry your original documents.\n\n— Shabri Appointment System",
    variables: ["citizen_name", "token_id", "time", "officer_name"],
  },
  {
    id: "queue_update",
    type: "Queue Update",
    icon: "🔢",
    channel: "WhatsApp",
    color: "#F59E0B",
    bg: "#FFFBEB",
    template: "Hello {citizen_name},\n\nQueue Update:\n\n🔢 Current Token: {current_token}\n📋 Your Token: {citizen_token}\n⏳ Estimated Wait: {wait_time} minutes\n\nPlease be ready at the waiting area.\n\n— Shabri Queue Management",
    variables: ["citizen_name", "current_token", "citizen_token", "wait_time"],
  },
  {
    id: "meeting_notify",
    type: "Meeting Notification",
    icon: "🤝",
    channel: "Email",
    color: "#6366F1",
    bg: "#F5F3FF",
    template: "Dear Ma'am,\n\nA meeting has been scheduled on your behalf.\n\n📌 Meeting: {meeting_title}\n👥 With: {meeting_with}\n📅 Date: {date}\n🕐 Time: {time}\n📡 Mode: {mode}\n🔗 Link: {meet_link}\n\nPlease review and confirm.\n\nRegards,\nStaff — Shabri Appointment System",
    variables: ["meeting_title", "meeting_with", "date", "time", "mode", "meet_link"],
  },
];

const SAMPLE_DATA = {
  citizen_name: "Rahul Sharma",
  officer_name: "Leena Bansod",
  token_id: "SHA-1001",
  time: "11:00 AM",
  date: "16 June 2026",
  current_token: "SHA-1005",
  citizen_token: "SHA-1010",
  wait_time: "30",
  meeting_title: "Head Office Review",
  meeting_with: "Head Office",
  mode: "Google Meet",
  meet_link: "https://meet.google.com/abc-defg-hij",
};

function renderTemplate(template, data) {
  return template.replace(/\{(\w+)\}/g, (_, key) => data[key] || `{${key}}`);
}

export default function Notifications() {
  const [activeTab, setActiveTab] = useState("confirmation");
  const [editMode, setEditMode] = useState(false);
  const [templates, setTemplates] = useState(TEMPLATES);
  const [editContent, setEditContent] = useState("");
  const [sent, setSent] = useState({});

  const activeTemplate = templates.find(t => t.id === activeTab);
  const preview = renderTemplate(activeTemplate?.template || "", SAMPLE_DATA);

  const handleSend = (action) => {
    setSent({ ...sent, [activeTab]: action });
    setTimeout(() => setSent(s => { const n = { ...s }; delete n[activeTab]; return n; }), 3000);
  };

  const handleSaveEdit = () => {
    setTemplates(prev => prev.map(t => t.id === activeTab ? { ...t, template: editContent } : t));
    setEditMode(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.pageHeader}>
        <div>
          <p style={styles.eyebrow}>STAFF PORTAL</p>
          <h1 style={styles.title}>Notification Templates</h1>
          <p style={styles.sub}>Manage and send WhatsApp & Email notification templates.</p>
        </div>
        <div style={styles.channelBadges}>
          <span style={styles.waBadge}>💬 WhatsApp</span>
          <span style={styles.emailBadge}>📧 Email</span>
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsRow}>
        <StatCard label="Templates" value="4" icon="📄" color="#2563EB" />
        <StatCard label="Sent Today" value="32" icon="📤" color="#10B981" />
        <StatCard label="WhatsApp" value="3" icon="💬" color="#25D366" />
        <StatCard label="Email" value="1" icon="📧" color="#6366F1" />
      </div>

      <div style={styles.mainLayout}>
        {/* Template Tabs (left) */}
        <div style={styles.tabsPanel}>
          <p style={styles.tabsLabel}>TEMPLATES</p>
          {templates.map(t => (
            <button key={t.id} onClick={() => { setActiveTab(t.id); setEditMode(false); }}
              style={{ ...styles.templateTab, background: activeTab === t.id ? "#EFF6FF" : "#fff", borderColor: activeTab === t.id ? "#2563EB" : "#E2E8F0" }}>
              <div style={{ ...styles.templateIcon, background: t.bg, color: t.color }}>{t.icon}</div>
              <div style={{ flex: 1, textAlign: "left" }}>
                <p style={{ margin: 0, fontWeight: "700", fontSize: "13px", color: activeTab === t.id ? "#2563EB" : "#111827" }}>{t.type}</p>
                <p style={{ margin: "3px 0 0", fontSize: "11px", color: "#94A3B8" }}>via {t.channel}</p>
              </div>
              {activeTab === t.id && <span style={styles.activeIndicator}>●</span>}
            </button>
          ))}
        </div>

        {/* Main Panel (right) */}
        {activeTemplate && (
          <div style={styles.mainPanel}>
            {/* Template Header */}
            <div style={styles.templateHeader}>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <div style={{ ...styles.bigIcon, background: activeTemplate.bg, color: activeTemplate.color }}>
                  {activeTemplate.icon}
                </div>
                <div>
                  <h2 style={styles.templateTitle}>{activeTemplate.type}</h2>
                  <span style={{ ...styles.channelBadge, background: activeTemplate.bg, color: activeTemplate.color }}>
                    via {activeTemplate.channel}
                  </span>
                </div>
              </div>
              <button onClick={() => { setEditMode(!editMode); setEditContent(activeTemplate.template); }}
                style={styles.editBtn}>
                {editMode ? "✕ Cancel" : "✏️ Edit Template"}
              </button>
            </div>

            {/* Variables */}
            <div style={styles.variablesCard}>
              <p style={styles.varsLabel}>TEMPLATE VARIABLES</p>
              <div style={styles.varsRow}>
                {activeTemplate.variables.map(v => (
                  <span key={v} style={styles.varTag}>{`{${v}}`}</span>
                ))}
              </div>
            </div>

            {/* Edit / Preview Split */}
            <div style={styles.previewLayout}>
              {/* Template Editor */}
              <div style={styles.editorCard}>
                <p style={styles.editorLabel}>TEMPLATE</p>
                {editMode ? (
                  <>
                    <textarea
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      style={styles.editArea}
                      rows={14}
                    />
                    <button onClick={handleSaveEdit} style={styles.saveEditBtn}>Save Template</button>
                  </>
                ) : (
                  <pre style={styles.templateText}>{activeTemplate.template}</pre>
                )}
              </div>

              {/* Preview */}
              <div style={styles.previewCard}>
                <p style={styles.previewLabel}>LIVE PREVIEW</p>
                <div style={{ ...styles.previewBubble, borderColor: activeTemplate.color }}>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "10px", paddingBottom: "10px", borderBottom: `1px solid ${activeTemplate.bg}` }}>
                    <span style={{ fontSize: "18px" }}>{activeTemplate.channel === "WhatsApp" ? "💬" : "📧"}</span>
                    <span style={{ fontWeight: "700", fontSize: "13px", color: activeTemplate.color }}>
                      {activeTemplate.channel === "WhatsApp" ? "WhatsApp Message" : "Email Preview"}
                    </span>
                  </div>
                  <pre style={styles.previewText}>{preview}</pre>
                </div>

                {/* Send Actions */}
                <div style={styles.sendActions}>
                  {sent[activeTab] ? (
                    <div style={styles.sentConfirm}>
                      ✅ {sent[activeTab]} sent successfully!
                    </div>
                  ) : (
                    <>
                      <button onClick={() => handleSend("Confirmation")} style={{ ...styles.sendBtn, background: activeTemplate.color }}>
                        Send Confirmation
                      </button>
                      <button onClick={() => handleSend("Reminder")} style={styles.sendBtnOutline}>
                        Send Reminder
                      </button>
                      <button onClick={() => handleSend("Update")} style={styles.sendBtnOutline}>
                        Send Update
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div style={{ background: "#fff", borderRadius: "14px", padding: "18px 22px", flex: 1, minWidth: "120px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", borderTop: `4px solid ${color}` }}>
      <span style={{ fontSize: "18px" }}>{icon}</span>
      <p style={{ margin: "8px 0 2px", fontSize: "11px", color: "#94A3B8", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</p>
      <p style={{ margin: 0, fontSize: "24px", fontWeight: "800", color }}>{value}</p>
    </div>
  );
}

const styles = {
  page: { padding: "36px 40px", background: "#F8FAFC", minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif" },
  pageHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "24px", flexWrap: "wrap", gap: "16px" },
  eyebrow: { margin: "0 0 6px", fontSize: "11px", fontWeight: "700", letterSpacing: "2px", color: "#2563EB" },
  title: { margin: "0 0 4px", fontSize: "28px", fontWeight: "800", color: "#111827" },
  sub: { margin: 0, fontSize: "14px", color: "#64748B" },
  channelBadges: { display: "flex", gap: "10px" },
  waBadge: { background: "#ECFDF5", color: "#059669", border: "1px solid #A7F3D0", padding: "8px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: "700" },
  emailBadge: { background: "#F5F3FF", color: "#7C3AED", border: "1px solid #DDD6FE", padding: "8px 16px", borderRadius: "20px", fontSize: "13px", fontWeight: "700" },
  statsRow: { display: "flex", gap: "16px", marginBottom: "24px", flexWrap: "wrap" },
  mainLayout: { display: "grid", gridTemplateColumns: "260px 1fr", gap: "20px" },
  tabsPanel: { background: "#fff", borderRadius: "16px", padding: "20px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", height: "fit-content", display: "flex", flexDirection: "column", gap: "8px" },
  tabsLabel: { margin: "0 0 8px 4px", fontSize: "10px", fontWeight: "700", letterSpacing: "1.5px", color: "#94A3B8" },
  templateTab: { display: "flex", alignItems: "center", gap: "12px", padding: "12px", borderRadius: "12px", border: "1.5px solid", cursor: "pointer", transition: "all 0.15s", width: "100%" },
  templateIcon: { width: "34px", height: "34px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", flexShrink: 0 },
  activeIndicator: { color: "#2563EB", fontSize: "10px" },
  mainPanel: { display: "flex", flexDirection: "column", gap: "16px" },
  templateHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fff", borderRadius: "16px", padding: "20px 24px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" },
  bigIcon: { width: "48px", height: "48px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 },
  templateTitle: { margin: "0 0 6px", fontSize: "18px", fontWeight: "700", color: "#111827" },
  channelBadge: { fontSize: "12px", fontWeight: "700", padding: "4px 10px", borderRadius: "20px" },
  editBtn: { background: "#F8FAFC", color: "#374151", border: "1.5px solid #E2E8F0", padding: "10px 18px", borderRadius: "10px", cursor: "pointer", fontWeight: "600", fontSize: "13px" },
  variablesCard: { background: "#fff", borderRadius: "12px", padding: "16px 20px", border: "1px solid #E2E8F0" },
  varsLabel: { margin: "0 0 10px", fontSize: "10px", fontWeight: "700", letterSpacing: "1.5px", color: "#94A3B8" },
  varsRow: { display: "flex", gap: "8px", flexWrap: "wrap" },
  varTag: { background: "#F1F5F9", color: "#374151", fontFamily: "monospace", fontSize: "12px", padding: "4px 10px", borderRadius: "6px", border: "1px solid #E2E8F0" },
  previewLayout: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  editorCard: { background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" },
  editorLabel: { margin: "0 0 12px", fontSize: "10px", fontWeight: "700", letterSpacing: "1.5px", color: "#94A3B8" },
  templateText: { margin: 0, fontSize: "12px", color: "#374151", lineHeight: "1.7", whiteSpace: "pre-wrap", fontFamily: "monospace", background: "#F8FAFC", padding: "14px", borderRadius: "10px", border: "1px solid #E2E8F0" },
  editArea: { width: "100%", padding: "12px", border: "1.5px solid #E2E8F0", borderRadius: "10px", fontSize: "12px", fontFamily: "monospace", lineHeight: "1.7", color: "#374151", background: "#F8FAFC", outline: "none", resize: "vertical", boxSizing: "border-box", marginBottom: "12px" },
  saveEditBtn: { background: "#2563EB", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "10px", fontWeight: "700", fontSize: "13px", cursor: "pointer" },
  previewCard: { background: "#fff", borderRadius: "16px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" },
  previewLabel: { margin: "0 0 12px", fontSize: "10px", fontWeight: "700", letterSpacing: "1.5px", color: "#94A3B8" },
  previewBubble: { background: "#F8FAFC", borderRadius: "12px", padding: "16px", border: "1.5px solid", marginBottom: "16px" },
  previewText: { margin: 0, fontSize: "12px", color: "#374151", lineHeight: "1.8", whiteSpace: "pre-wrap", fontFamily: "'Segoe UI', system-ui, sans-serif" },
  sendActions: { display: "flex", flexDirection: "column", gap: "8px" },
  sentConfirm: { background: "#ECFDF5", color: "#059669", border: "1px solid #A7F3D0", borderRadius: "10px", padding: "12px 16px", fontSize: "13px", fontWeight: "700", textAlign: "center" },
  sendBtn: { color: "#fff", border: "none", padding: "11px 16px", borderRadius: "10px", cursor: "pointer", fontWeight: "700", fontSize: "13px" },
  sendBtnOutline: { background: "#F8FAFC", color: "#374151", border: "1.5px solid #E2E8F0", padding: "10px 16px", borderRadius: "10px", cursor: "pointer", fontWeight: "600", fontSize: "13px" },
};