import tribalLogo from "../../assets/tribal-logo.jpg";
 
export default function MDDashboard() {
  const executiveMeetings = [
    {
      title: "Head Office Review",
      with: "Tribal Development Head Office",
      time: "2:00 PM",
      mode: "Google Meet",
    },
    {
      title: "Regional Officer Review",
      with: "Regional Office",
      time: "4:00 PM",
      mode: "Google Meet",
    },
  ];
 
  const upcomingCitizens = [
    {
      token: "SHA-1002",
      name: "Priya Patil",
      purpose: "Education Support",
      time: "11:10 AM",
    },
    {
      token: "SHA-1003",
      name: "Amit Kumar",
      purpose: "Certificate Verification",
      time: "11:20 AM",
    },
    {
      token: "SHA-1004",
      name: "Sneha More",
      purpose: "Scholarship Query",
      time: "11:30 AM",
    },
  ];
 
  return (
    <div style={{ minHeight: "100vh", background: "#F0F4FF", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
 
      {/* ── Inject keyframes ── */}
      <style>{`
        @keyframes pulse-ring {
          0%   { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(37,99,235,0.5); }
          70%  { transform: scale(1);    box-shadow: 0 0 0 12px rgba(37,99,235,0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(37,99,235,0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .stat-card:hover { transform: translateY(-4px) scale(1.02); }
        .stat-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .meeting-card:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(37,99,235,0.15) !important; }
        .meeting-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .join-btn:hover { filter: brightness(1.1); transform: scale(1.03); }
        .join-btn { transition: filter 0.15s, transform 0.15s; }
        .citizen-row:hover { background: #EFF6FF !important; }
        .citizen-row { transition: background 0.15s; }
      `}</style>
 
      {/* ── HEADER ── */}
      <div style={{
        background: "linear-gradient(135deg, #1E3A8A 0%, #2563EB 60%, #3B82F6 100%)",
        padding: "0 36px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 4px 24px rgba(37,99,235,0.3)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        minHeight: 80,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            background: "rgba(255,255,255,0.15)",
            border: "2px solid rgba(255,255,255,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            flexShrink: 0,
          }}>
            <img src={tribalLogo} alt="Logo" style={{ width: 48, height: 48, objectFit: "contain" }} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.7)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Government of Maharashtra
            </p>
            <h2 style={{ margin: "2px 0 0", fontSize: 15, fontWeight: 700, color: "#fff", lineHeight: 1.3 }}>
              Maharashtra State Cooperative Tribal Development Corporation Limited
            </h2>
          </div>
        </div>
 
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Live indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.12)", borderRadius: 99, padding: "8px 16px" }}>
            <span style={{
              width: 8, height: 8, borderRadius: "50%", background: "#4ADE80",
              animation: "pulse-ring 1.8s ease infinite",
              display: "inline-block",
            }} />
            <span style={{ fontSize: 12, color: "#fff", fontWeight: 600 }}>Live Dashboard</span>
          </div>
          {/* Date */}
          <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 10, padding: "8px 16px" }}>
            <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>
              {new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
            </p>
          </div>
        </div>
      </div>
 
      <div style={{ padding: "32px 36px 48px", animation: "fadeSlideUp 0.4s ease" }}>
 
        {/* ── WELCOME BANNER ── */}
        <div style={{
          background: "linear-gradient(120deg, #1E3A8A 0%, #2563EB 50%, #7C3AED 100%)",
          borderRadius: 24,
          padding: "36px 40px",
          marginBottom: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 8px 32px rgba(37,99,235,0.35)",
          position: "relative",
          overflow: "hidden",
        }}>
          {/* Decorative circles */}
          <div style={{ position: "absolute", top: -40, right: 120, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
          <div style={{ position: "absolute", bottom: -60, right: -20, width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
 
          <div style={{ position: "relative" }}>
            <p style={{ margin: "0 0 6px", fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Executive Monitoring Dashboard
            </p>
            <h1 style={{ margin: 0, fontSize: 36, fontWeight: 800, color: "#fff", lineHeight: 1.2 }}>
              Good Morning, Madam 🌿
            </h1>
            <p style={{ margin: "10px 0 0", fontSize: 15, color: "rgba(255,255,255,0.75)" }}>
              You have <strong style={{ color: "#fff" }}>18 citizens</strong> scheduled and <strong style={{ color: "#fff" }}>2 executive meetings</strong> today.
            </p>
          </div>
 
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 6,
            position: "relative",
          }}>
            <div style={{ fontSize: 48, lineHeight: 1 }}>👩‍💼</div>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: 600 }}>Leena Bansod</span>
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>Managing Director</span>
          </div>
        </div>
 
        {/* ── STAT CARDS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18, marginBottom: 28 }}>
          <StatCard title="Today's Citizens" value="18" icon="👥" gradient="linear-gradient(135deg,#3B82F6,#2563EB)" shadow="rgba(37,99,235,0.35)" />
          <StatCard title="Waiting" value="4" icon="⏳" gradient="linear-gradient(135deg,#F59E0B,#D97706)" shadow="rgba(217,119,6,0.35)" />
          <StatCard title="Meetings" value="3" icon="📋" gradient="linear-gradient(135deg,#10B981,#059669)" shadow="rgba(5,150,105,0.35)" />
          <StatCard title="Completed" value="12" icon="✅" gradient="linear-gradient(135deg,#8B5CF6,#7C3AED)" shadow="rgba(124,58,237,0.35)" />
        </div>
 
        {/* ── CURRENT + NEXT CITIZEN ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 28 }}>
          {/* Currently Meeting */}
          <div style={{
            background: "#fff",
            borderRadius: 22,
            padding: 28,
            boxShadow: "0 8px 32px rgba(37,99,235,0.12)",
            border: "2px solid #DBEAFE",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 4,
              background: "linear-gradient(90deg, #2563EB, #7C3AED)",
            }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <span style={{
                width: 10, height: 10, borderRadius: "50%", background: "#3B82F6",
                animation: "pulse-ring 1.8s ease infinite",
                display: "inline-block", flexShrink: 0,
              }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#2563EB", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                Currently Meeting
              </span>
            </div>
 
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
              <div style={{
                width: 52, height: 52, borderRadius: "50%",
                background: "linear-gradient(135deg,#DBEAFE,#EFF6FF)",
                border: "2px solid #BFDBFE",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, fontWeight: 700, color: "#2563EB",
              }}>
                RS
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#111827" }}>Rahul Sharma</h2>
                <p style={{ margin: 0, fontSize: 13, color: "#6B7280" }}>Scholarship Query · 11:00 AM</p>
              </div>
            </div>
 
            <div style={{
              background: "linear-gradient(135deg,#EFF6FF,#DBEAFE)",
              borderRadius: 14,
              padding: "14px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <span style={{ fontSize: 13, color: "#1E3A8A", fontWeight: 600 }}>Token</span>
              <span style={{ fontSize: 32, fontWeight: 900, color: "#2563EB", letterSpacing: "0.04em" }}>#1001</span>
            </div>
          </div>
 
          {/* Next Citizen */}
          <div style={{
            background: "#fff",
            borderRadius: 22,
            padding: 28,
            boxShadow: "0 8px 32px rgba(16,185,129,0.1)",
            border: "2px solid #D1FAE5",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 4,
              background: "linear-gradient(90deg, #10B981, #059669)",
            }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#059669", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                ⏭ Next Citizen
              </span>
            </div>
 
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
              <div style={{
                width: 52, height: 52, borderRadius: "50%",
                background: "linear-gradient(135deg,#D1FAE5,#ECFDF5)",
                border: "2px solid #A7F3D0",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, fontWeight: 700, color: "#059669",
              }}>
                PP
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#111827" }}>Priya Patil</h2>
                <p style={{ margin: 0, fontSize: 13, color: "#6B7280" }}>Education Support · 11:10 AM</p>
              </div>
            </div>
 
            <div style={{
              background: "linear-gradient(135deg,#ECFDF5,#D1FAE5)",
              borderRadius: 14,
              padding: "14px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <span style={{ fontSize: 13, color: "#065F46", fontWeight: 600 }}>Token</span>
              <span style={{ fontSize: 32, fontWeight: 900, color: "#10B981", letterSpacing: "0.04em" }}>#1002</span>
            </div>
          </div>
        </div>
 
        {/* ── EXECUTIVE MEETINGS ── */}
        <div style={{
          background: "#fff",
          borderRadius: 22,
          padding: 28,
          boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
          marginBottom: 28,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
            <div>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "#6B7280", letterSpacing: "0.08em", textTransform: "uppercase" }}>Scheduled</p>
              <h2 style={{ margin: "2px 0 0", fontSize: 20, fontWeight: 800, color: "#111827" }}>Executive Meetings</h2>
            </div>
            <span style={{
              background: "#EFF6FF",
              color: "#2563EB",
              fontSize: 12,
              fontWeight: 700,
              padding: "5px 14px",
              borderRadius: 99,
              border: "1px solid #BFDBFE",
            }}>2 Today</span>
          </div>
 
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            {executiveMeetings.map((meeting, index) => (
              <div
                key={index}
                className="meeting-card"
                style={{
                  background: "linear-gradient(135deg,#F8FAFF,#F0F4FF)",
                  padding: "22px 24px",
                  borderRadius: 18,
                  border: "1px solid #DBEAFE",
                  boxShadow: "0 4px 16px rgba(37,99,235,0.07)",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                  <div>
                    <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "#6B7280", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                      {index === 0 ? "Afternoon" : "Evening"}
                    </p>
                    <h3 style={{ margin: "4px 0 0", fontSize: 17, fontWeight: 800, color: "#111827" }}>{meeting.title}</h3>
                  </div>
                  <span style={{
                    background: "#fff",
                    color: "#2563EB",
                    fontSize: 13,
                    fontWeight: 700,
                    padding: "5px 12px",
                    borderRadius: 99,
                    border: "1px solid #BFDBFE",
                    flexShrink: 0,
                    marginLeft: 10,
                  }}>{meeting.time}</span>
                </div>
 
                <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 18 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14 }}>🏛️</span>
                    <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{meeting.with}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14 }}>🎥</span>
                    <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{meeting.mode}</span>
                  </div>
                </div>
 
                <button
                  className="join-btn"
                  style={{
                    background: "linear-gradient(135deg,#10B981,#059669)",
                    color: "white",
                    border: "none",
                    padding: "11px 22px",
                    borderRadius: 12,
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "0.03em",
                    boxShadow: "0 4px 12px rgba(16,185,129,0.35)",
                    width: "100%",
                  }}
                >
                  🔗 Join Meeting
                </button>
              </div>
            ))}
          </div>
        </div>
 
        {/* ── FOCUS + UPCOMING ── */}
        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 18 }}>
 
          {/* Today's Focus */}
          <div style={{
            background: "#fff",
            borderRadius: 22,
            padding: 28,
            boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
          }}>
            <p style={{ margin: "0 0 4px", fontSize: 11, fontWeight: 700, color: "#6B7280", letterSpacing: "0.08em", textTransform: "uppercase" }}>Overview</p>
            <h2 style={{ margin: "0 0 24px", fontSize: 20, fontWeight: 800, color: "#111827" }}>Today's Focus</h2>
 
            <FocusItem title="Citizens Waiting" value="4" color="#F59E0B" bg="#FEF3C7" />
            <FocusItem title="Meetings Today" value="3" color="#2563EB" bg="#DBEAFE" />
            <FocusItem title="Completed Citizens" value="12" color="#10B981" bg="#D1FAE5" />
 
            {/* Mini progress */}
            <div style={{ marginTop: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: "#6B7280", fontWeight: 600 }}>Daily Progress</span>
                <span style={{ fontSize: 12, color: "#2563EB", fontWeight: 700 }}>67%</span>
              </div>
              <div style={{ height: 8, background: "#F3F4F6", borderRadius: 99, overflow: "hidden" }}>
                <div style={{
                  height: "100%",
                  width: "67%",
                  background: "linear-gradient(90deg,#2563EB,#7C3AED)",
                  borderRadius: 99,
                }} />
              </div>
              <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 6 }}>12 of 18 citizens completed</p>
            </div>
          </div>
 
          {/* Upcoming Citizens */}
          <div style={{
            background: "#fff",
            borderRadius: 22,
            padding: 28,
            boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
              <div>
                <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "#6B7280", letterSpacing: "0.08em", textTransform: "uppercase" }}>Queue</p>
                <h2 style={{ margin: "2px 0 0", fontSize: 20, fontWeight: 800, color: "#111827" }}>Upcoming Citizens</h2>
              </div>
              <span style={{
                background: "#FEF3C7",
                color: "#D97706",
                fontSize: 12,
                fontWeight: 700,
                padding: "5px 14px",
                borderRadius: 99,
                border: "1px solid #FDE68A",
              }}>3 in queue</span>
            </div>
 
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F8FAFC" }}>
                  <th style={{ ...th, borderRadius: "10px 0 0 10px", paddingLeft: 14 }}>Token</th>
                  <th style={th}>Citizen</th>
                  <th style={th}>Purpose</th>
                  <th style={{ ...th, borderRadius: "0 10px 10px 0", paddingRight: 14 }}>Time</th>
                </tr>
              </thead>
              <tbody>
                {upcomingCitizens.map((citizen, index) => (
                  <tr key={index} className="citizen-row" style={{ borderRadius: 10, cursor: "default" }}>
                    <td style={{ ...td, paddingLeft: 14 }}>
                      <span style={{
                        background: "#EFF6FF",
                        color: "#2563EB",
                        fontSize: 12,
                        fontWeight: 700,
                        padding: "4px 10px",
                        borderRadius: 99,
                        border: "1px solid #BFDBFE",
                        whiteSpace: "nowrap",
                      }}>
                        {citizen.token}
                      </span>
                    </td>
                    <td style={td}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          width: 32, height: 32, borderRadius: "50%",
                          background: `hsl(${(index * 80 + 200)},70%,90%)`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 12, fontWeight: 700,
                          color: `hsl(${(index * 80 + 200)},60%,40%)`,
                          flexShrink: 0,
                        }}>
                          {citizen.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{citizen.name}</span>
                      </div>
                    </td>
                    <td style={td}>
                      <span style={{
                        background: "#F3F4F6",
                        color: "#374151",
                        fontSize: 12,
                        fontWeight: 500,
                        padding: "4px 10px",
                        borderRadius: 8,
                      }}>
                        {citizen.purpose}
                      </span>
                    </td>
                    <td style={{ ...td, paddingRight: 14 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#6B7280" }}>🕐 {citizen.time}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
 
// ── Sub-components ──────────────────────────────────────────────────────────────
 
function StatCard({ title, value, icon, gradient, shadow }) {
  return (
    <div
      className="stat-card"
      style={{
        background: gradient,
        color: "white",
        borderRadius: 22,
        padding: "28px 24px",
        boxShadow: `0 8px 24px ${shadow}`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative circle */}
      <div style={{
        position: "absolute", top: -20, right: -20,
        width: 90, height: 90, borderRadius: "50%",
        background: "rgba(255,255,255,0.1)",
      }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.85)", letterSpacing: "0.03em" }}>{title}</p>
        <span style={{
          fontSize: 22,
          background: "rgba(255,255,255,0.15)",
          borderRadius: 10,
          padding: "6px 8px",
          lineHeight: 1,
        }}>{icon}</span>
      </div>
      <h1 style={{ margin: 0, fontSize: 52, fontWeight: 900, lineHeight: 1, letterSpacing: "-0.02em" }}>{value}</h1>
    </div>
  );
}
 
function FocusItem({ title, value, color, bg }) {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "14px 0",
      borderBottom: "1px solid #F3F4F6",
    }}>
      <span style={{ fontSize: 14, color: "#374151", fontWeight: 500 }}>{title}</span>
      <span style={{
        background: bg,
        color: color,
        fontWeight: 800,
        fontSize: 15,
        padding: "4px 14px",
        borderRadius: 99,
        minWidth: 36,
        textAlign: "center",
      }}>{value}</span>
    </div>
  );
}
 
const th = {
  textAlign: "left",
  padding: "10px 12px",
  color: "#6B7280",
  fontSize: 12,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
};
 
const td = {
  padding: "14px 12px",
  borderBottom: "1px solid #F3F4F6",
  fontSize: 14,
  color: "#374151",
};