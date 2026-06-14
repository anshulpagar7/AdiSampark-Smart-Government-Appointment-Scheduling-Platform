import { useState, useEffect } from "react";
import Header from "../components/Header";
import { translations } from "../translations";

// ─── Constants ────────────────────────────────────────────────────────────────

const OFFICER = { name: "Leena Bansod", designation: "Managing Director" };

const ORG_NAME = "Maharashtra State Cooperative Tribal Development Corporation Limited";

const TIME_SLOTS = [
  { time: "11:00 AM", group: "morning" },
  { time: "11:10 AM", group: "morning" },
  { time: "11:20 AM", group: "morning" },
  { time: "11:30 AM", group: "morning" },
  { time: "11:40 AM", group: "morning" },
  { time: "11:50 AM", group: "morning" },
  { time: "12:00 PM", group: "morning" },
  { time: "12:10 PM", group: "morning" },
  { time: "12:20 PM", group: "morning" },
  { time: "12:30 PM", group: "morning" },
  { time: "12:40 PM", group: "morning" },
  { time: "12:50 PM", group: "morning" },
  { time: "01:00 PM", group: "morning" },
  { time: "01:10 PM", group: "morning" },
  { time: "01:20 PM", group: "morning" },
  { time: "LUNCH BREAK", group: "break", disabled: true },
  { time: "02:30 PM", group: "afternoon" },
  { time: "02:40 PM", group: "afternoon" },
  { time: "02:50 PM", group: "afternoon" },
  { time: "03:00 PM", group: "afternoon" },
  { time: "03:10 PM", group: "afternoon" },
  { time: "03:20 PM", group: "afternoon" },
  { time: "03:30 PM", group: "afternoon" },
  { time: "03:40 PM", group: "afternoon" },
  { time: "03:50 PM", group: "afternoon" },
  { time: "04:00 PM", group: "afternoon" },
  { time: "04:10 PM", group: "afternoon" },
  { time: "04:20 PM", group: "afternoon" },
  { time: "04:30 PM", group: "afternoon" },
  { time: "04:40 PM", group: "afternoon" },
  { time: "04:50 PM", group: "afternoon" },
];

// Total real steps: Landing(0) → Type(1) → Purpose(2) → Date(3, future only) → Slot(4) → Details(5) → Confirmation(6)
const TOTAL_STEPS = 5; // visible progress steps (excluding landing & confirmation)

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressBar({ step }) {
  // step 0 = landing (no bar), steps 1–5 shown, step 6 = confirmation (full)
  if (step === 0) return null;
  const current = step > 5 ? TOTAL_STEPS : step;
  const pct = Math.round((current / TOTAL_STEPS) * 100);
  return (
    <div style={pb.wrapper}>
      <div style={pb.track}>
        <div style={{ ...pb.fill, width: `${pct}%` }} />
      </div>
      <p style={pb.label}>
        {step > 5 ? "Complete" : `Step ${current} of ${TOTAL_STEPS}`}
      </p>
    </div>
  );
}

const pb = {
  wrapper: { padding: "16px 20px 0", maxWidth: 640, margin: "0 auto" },
  track: {
    height: 6,
    background: "#DBEAFE",
    borderRadius: 99,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    background: "linear-gradient(90deg,#2563EB,#1E3A8A)",
    borderRadius: 99,
    transition: "width 0.4s ease",
  },
  label: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "right",
    marginTop: 4,
    marginBottom: 0,
    fontWeight: 600,
    letterSpacing: "0.04em",
  },
};

function Card({ children, style = {} }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        padding: "32px 28px",
        boxShadow: "0 4px 24px rgba(37,99,235,0.07)",
        maxWidth: 640,
        margin: "20px auto 0",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function StepHeading({ children }) {
  return (
    <h2
      style={{
        fontSize: 22,
        fontWeight: 700,
        color: "#111827",
        marginBottom: 20,
        marginTop: 0,
      }}
    >
      {children}
    </h2>
  );
}

function PrimaryButton({ children, onClick, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "100%",
        padding: "16px",
        fontSize: 16,
        fontWeight: 700,
        border: "none",
        borderRadius: 12,
        background: disabled
          ? "#93C5FD"
          : "linear-gradient(135deg,#2563EB,#1E3A8A)",
        color: "#fff",
        cursor: disabled ? "not-allowed" : "pointer",
        marginTop: 16,
        letterSpacing: "0.02em",
        boxShadow: disabled ? "none" : "0 4px 14px rgba(37,99,235,0.35)",
        transition: "transform 0.1s",
      }}
    >
      {children}
    </button>
  );
}

function OfficerBadge() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        background: "#EFF6FF",
        border: "1px solid #BFDBFE",
        borderRadius: 14,
        padding: "16px 20px",
        marginBottom: 24,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: "linear-gradient(135deg,#2563EB,#1E3A8A)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: 20,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        LB
      </div>
      <div>
        <p
          style={{
            margin: 0,
            fontWeight: 700,
            fontSize: 16,
            color: "#1E3A8A",
          }}
        >
          {OFFICER.name}
        </p>
        <p style={{ margin: 0, fontSize: 13, color: "#6B7280" }}>
          {OFFICER.designation}
        </p>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function CitizenBooking() {
  const [language, setLanguage] = useState("en");
  const [step, setStep] = useState(0);

  const [appointmentType, setAppointmentType] = useState("");
  const [selectedPurpose, setSelectedPurpose] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [notes, setNotes] = useState("");
  const [hovered, setHovered] = useState(null);

  const [appointmentId] = useState(
    "SHA-" + Math.floor(1000 + Math.random() * 9000)
  );

  const t = translations[language];

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const todayStr = new Date().toISOString().split("T")[0];

  // ── Step logic: after purpose, go to date picker only if future
  function handlePurposeContinue() {
    if (!selectedPurpose.trim()) return;
    appointmentType === "future" ? setStep(3) : setStep(4);
  }

  // ── Confirmation display date
  const displayDate =
    appointmentType === "today"
      ? new Date().toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : selectedDate
      ? new Date(selectedDate).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "";

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC" }}>
      <Header language={language} setLanguage={setLanguage} />

      {/* Progress bar for steps 1–6 */}
      <ProgressBar step={step} />

      {/* ── STEP 0: Landing ── */}
      {step === 0 && (
        <div style={landing.outer}>
          {/* Hero gradient card */}
          <div style={landing.hero}>
            {/* Emblem placeholder */}
            <div style={landing.emblem}>
              <span style={{ fontSize: 32 }}>🏛️</span>
            </div>
            <p style={landing.gov}>Government of Maharashtra</p>
            <h1 style={landing.org}>{ORG_NAME}</h1>
            <p style={landing.tagline}>Smart Appointment Management System</p>

            <button
              style={landing.cta}
              onClick={() => setStep(1)}
              onMouseEnter={() => setHovered("cta")}
              onMouseLeave={() => setHovered(null)}
            >
              <span style={{ marginRight: 8 }}>📅</span>
              {t.bookAppointment || "Book Appointment"}
            </button>
          </div>

          {/* Office Timings card */}
          <div style={landing.timingsCard}>
            <p style={landing.timingsHeading}>🕐 Office Timings</p>
            <div style={landing.timingsGrid}>
              <div style={landing.timingRow}>
                <span style={landing.timingDot("green")} />
                <span>11:00 AM – 1:30 PM</span>
              </div>
              <div style={landing.timingRow}>
                <span style={landing.timingDot("amber")} />
                <span style={{ color: "#92400E" }}>
                  Lunch Break 1:30 PM – 2:30 PM
                </span>
              </div>
              <div style={landing.timingRow}>
                <span style={landing.timingDot("green")} />
                <span>2:30 PM – 5:00 PM</span>
              </div>
            </div>
          </div>

          {/* Officer card */}
          <Card style={{ maxWidth: 640 }}>
            <p
              style={{
                margin: "0 0 14px",
                fontWeight: 700,
                fontSize: 13,
                color: "#2563EB",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Appointments With
            </p>
            <OfficerBadge />
          </Card>
        </div>
      )}

      {/* ── STEP 1: Appointment Type ── */}
      {step === 1 && (
        <Card>
          <StepHeading>{t.chooseType || "Choose Appointment Type"}</StepHeading>
          <OfficerBadge />
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              {
                key: "today",
                icon: "🏢",
                label: t.today || "Today's Appointment",
                desc: "Book an appointment for today",
              },
              {
                key: "future",
                icon: "📅",
                label: t.future || "Future Appointment",
                desc: "Schedule for another date",
              },
            ].map((opt) => (
              <div
                key={opt.key}
                onClick={() => {
                  setAppointmentType(opt.key);
                  setStep(2);
                }}
                style={{
                  border: `2px solid ${
                    appointmentType === opt.key ? "#2563EB" : "#E5E7EB"
                  }`,
                  borderRadius: 16,
                  padding: "20px 22px",
                  cursor: "pointer",
                  background:
                    appointmentType === opt.key ? "#EFF6FF" : "#fff",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  transition: "all 0.15s",
                }}
              >
                <span style={{ fontSize: 28 }}>{opt.icon}</span>
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontWeight: 700,
                      fontSize: 16,
                      color: "#111827",
                    }}
                  >
                    {opt.label}
                  </p>
                  <p style={{ margin: 0, fontSize: 13, color: "#6B7280" }}>
                    {opt.desc}
                  </p>
                </div>
                <span
                  style={{
                    marginLeft: "auto",
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    border: `2px solid ${
                      appointmentType === opt.key ? "#2563EB" : "#D1D5DB"
                    }`,
                    background:
                      appointmentType === opt.key ? "#2563EB" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {appointmentType === opt.key && (
                    <span style={{ color: "#fff", fontSize: 13 }}>✓</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── STEP 2: Purpose ── */}
      {step === 2 && (
        <Card>
          <StepHeading>{t.purpose || "Purpose of Visit"}</StepHeading>
          <OfficerBadge />
          <textarea
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: 12,
              border: "1.5px solid #D1D5DB",
              fontSize: 15,
              color: "#111827",
              resize: "vertical",
              minHeight: 130,
              fontFamily: "inherit",
              outline: "none",
              boxSizing: "border-box",
              lineHeight: 1.6,
              transition: "border-color 0.15s",
            }}
            placeholder="Enter purpose of visit…"
            value={selectedPurpose}
            onChange={(e) => setSelectedPurpose(e.target.value)}
            onFocus={(e) => (e.target.style.borderColor = "#2563EB")}
            onBlur={(e) => (e.target.style.borderColor = "#D1D5DB")}
          />
          <PrimaryButton
            onClick={handlePurposeContinue}
            disabled={!selectedPurpose.trim()}
          >
            Continue →
          </PrimaryButton>
        </Card>
      )}

      {/* ── STEP 3: Date (Future only) ── */}
      {step === 3 && (
        <Card>
          <StepHeading>Select Date</StepHeading>
          <OfficerBadge />
          <label
            style={{
              display: "block",
              fontSize: 13,
              fontWeight: 600,
              color: "#374151",
              marginBottom: 8,
            }}
          >
            Choose a date
          </label>
          <input
            type="date"
            min={todayStr}
            style={{
              width: "100%",
              padding: "13px 16px",
              borderRadius: 12,
              border: "1.5px solid #D1D5DB",
              fontSize: 16,
              color: "#111827",
              outline: "none",
              boxSizing: "border-box",
              fontFamily: "inherit",
            }}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <PrimaryButton
            onClick={() => setStep(4)}
            disabled={!selectedDate}
          >
            Continue →
          </PrimaryButton>
        </Card>
      )}

      {/* ── STEP 4: Time Slot ── */}
      {step === 4 && (
        <Card>
          <StepHeading>Select Time Slot</StepHeading>
          <OfficerBadge />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 10,
            }}
          >
            {TIME_SLOTS.map((s, i) => {
              if (s.disabled) {
                return (
                  <div
                    key={i}
                    style={{
                      gridColumn: "1 / -1",
                      background: "#FEF3C7",
                      color: "#92400E",
                      borderRadius: 10,
                      padding: "10px",
                      textAlign: "center",
                      fontSize: 13,
                      fontWeight: 700,
                      letterSpacing: "0.05em",
                    }}
                  >
                    🍽 {s.time}
                  </div>
                );
              }
              const isSelected = selectedSlot === s.time;
              return (
                <button
                  key={i}
                  onClick={() => setSelectedSlot(s.time)}
                  style={{
                    padding: "12px 4px",
                    borderRadius: 10,
                    border: `2px solid ${isSelected ? "#2563EB" : "#E5E7EB"}`,
                    background: isSelected
                      ? "linear-gradient(135deg,#2563EB,#1E3A8A)"
                      : "#F9FAFB",
                    color: isSelected ? "#fff" : "#374151",
                    fontWeight: isSelected ? 700 : 500,
                    fontSize: 13,
                    cursor: "pointer",
                    transform: isSelected ? "scale(1.04)" : "scale(1)",
                    transition: "all 0.15s",
                    boxShadow: isSelected
                      ? "0 4px 12px rgba(37,99,235,0.3)"
                      : "none",
                  }}
                >
                  {s.time}
                </button>
              );
            })}
          </div>
          <PrimaryButton
            onClick={() => setStep(5)}
            disabled={!selectedSlot}
          >
            Continue →
          </PrimaryButton>
        </Card>
      )}

      {/* ── STEP 5: Personal Details ── */}
      {step === 5 && (
        <Card>
          <StepHeading>{t.details || "Your Details"}</StepHeading>
          <OfficerBadge />
          {[
            {
              label: "Full Name",
              value: name,
              set: setName,
              placeholder: "Enter your full name",
              type: "text",
            },
            {
              label: "Mobile Number",
              value: mobile,
              set: setMobile,
              placeholder: "10-digit mobile number",
              type: "tel",
            },
          ].map((field) => (
            <div key={field.label} style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: 6,
                }}
              >
                {field.label}
              </label>
              <input
                type={field.type}
                style={{
                  width: "100%",
                  padding: "13px 16px",
                  borderRadius: 12,
                  border: "1.5px solid #D1D5DB",
                  fontSize: 15,
                  color: "#111827",
                  outline: "none",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
                placeholder={field.placeholder}
                value={field.value}
                onChange={(e) => field.set(e.target.value)}
                onFocus={(e) => (e.target.style.borderColor = "#2563EB")}
                onBlur={(e) => (e.target.style.borderColor = "#D1D5DB")}
              />
            </div>
          ))}
          <div style={{ marginBottom: 4 }}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 600,
                color: "#374151",
                marginBottom: 6,
              }}
            >
              Additional Notes{" "}
              <span style={{ fontWeight: 400, color: "#9CA3AF" }}>
                (optional)
              </span>
            </label>
            <textarea
              style={{
                width: "100%",
                padding: "13px 16px",
                borderRadius: 12,
                border: "1.5px solid #D1D5DB",
                fontSize: 15,
                color: "#111827",
                resize: "vertical",
                minHeight: 90,
                fontFamily: "inherit",
                outline: "none",
                boxSizing: "border-box",
              }}
              placeholder="Any additional information…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onFocus={(e) => (e.target.style.borderColor = "#2563EB")}
              onBlur={(e) => (e.target.style.borderColor = "#D1D5DB")}
            />
          </div>
          <PrimaryButton
            onClick={() => setStep(6)}
            disabled={!name.trim() || !mobile.trim()}
          >
            {t.confirm || "Confirm Appointment"} →
          </PrimaryButton>
        </Card>
      )}

      {/* ── STEP 6: Confirmation ── */}
      {step === 6 && (
        <div style={{ maxWidth: 640, margin: "20px auto 40px", padding: "0 16px" }}>
          {/* Success banner */}
          <div style={confirm.banner}>
            <div style={confirm.checkCircle}>✓</div>
            <div>
              <p style={{ margin: 0, fontWeight: 800, fontSize: 20, color: "#fff" }}>
                {t.confirmed || "Appointment Confirmed!"}
              </p>
              <p style={{ margin: 0, fontSize: 13, color: "#BFDBFE", marginTop: 2 }}>
                Please arrive 10 minutes before your slot
              </p>
            </div>
          </div>

          {/* Token */}
          <div style={confirm.tokenCard}>
            <p style={confirm.tokenLabel}>TOKEN NUMBER</p>
            <p style={confirm.tokenValue}>{appointmentId}</p>
          </div>

          {/* Details card */}
          <div style={confirm.detailsCard}>
            <p style={confirm.sectionLabel}>Appointment Details</p>

            <div style={confirm.row}>
              <span style={confirm.rowIcon}>👩‍💼</span>
              <div>
                <p style={confirm.rowLabel}>Meeting With</p>
                <p style={confirm.rowValue}>
                  {OFFICER.name}
                  <span
                    style={{
                      marginLeft: 8,
                      fontSize: 12,
                      color: "#6B7280",
                      fontWeight: 400,
                    }}
                  >
                    {OFFICER.designation}
                  </span>
                </p>
              </div>
            </div>

            <div style={confirm.divider} />

            <div style={confirm.row}>
              <span style={confirm.rowIcon}>📋</span>
              <div>
                <p style={confirm.rowLabel}>Purpose of Visit</p>
                <p style={confirm.rowValue}>{selectedPurpose}</p>
              </div>
            </div>

            <div style={confirm.divider} />

            <div style={confirm.row}>
              <span style={confirm.rowIcon}>📅</span>
              <div>
                <p style={confirm.rowLabel}>Date</p>
                <p style={confirm.rowValue}>{displayDate}</p>
              </div>
            </div>

            <div style={confirm.divider} />

            <div style={confirm.row}>
              <span style={confirm.rowIcon}>🕐</span>
              <div>
                <p style={confirm.rowLabel}>Time Slot</p>
                <p style={confirm.rowValue}>{selectedSlot}</p>
              </div>
            </div>

            <div style={confirm.divider} />

            <div style={{ display: "flex", gap: 0 }}>
              <div style={{ flex: 1, ...confirm.row }}>
                <span style={confirm.rowIcon}>🔢</span>
                <div>
                  <p style={confirm.rowLabel}>Queue Position</p>
                  <p style={confirm.rowValue}>#12</p>
                </div>
              </div>
              <div style={{ flex: 1, ...confirm.row }}>
                <span style={confirm.rowIcon}>⏱</span>
                <div>
                  <p style={confirm.rowLabel}>Est. Wait</p>
                  <p style={confirm.rowValue}>~120 mins</p>
                </div>
              </div>
            </div>

            <div style={confirm.divider} />

            <div style={confirm.row}>
              <span style={confirm.rowIcon}>👤</span>
              <div>
                <p style={confirm.rowLabel}>Registered Name</p>
                <p style={confirm.rowValue}>{name}</p>
              </div>
            </div>

            <div style={confirm.divider} />

            <div style={confirm.row}>
              <span style={confirm.rowIcon}>📱</span>
              <div>
                <p style={confirm.rowLabel}>Mobile</p>
                <p style={confirm.rowValue}>{mobile}</p>
              </div>
            </div>
          </div>

          {/* WhatsApp CTA */}
          <a
            href={`https://wa.me/?text=My appointment at MSTDCL is confirmed. Token: ${appointmentId}. Time: ${selectedSlot} on ${displayDate}.`}
            target="_blank"
            rel="noopener noreferrer"
            style={confirm.whatsapp}
          >
            <span style={{ fontSize: 20 }}>💬</span> Receive WhatsApp Updates
          </a>

          {/* Book another */}
          <button
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 12,
              border: "1.5px solid #D1D5DB",
              background: "#fff",
              color: "#374151",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              marginTop: 12,
            }}
            onClick={() => {
              setStep(0);
              setAppointmentType("");
              setSelectedPurpose("");
              setSelectedDate("");
              setSelectedSlot("");
              setName("");
              setMobile("");
              setNotes("");
            }}
          >
            ← Book Another Appointment
          </button>
        </div>
      )}

      {/* Bottom padding */}
      <div style={{ height: 40 }} />

      {/* Global responsive style injection */}
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        @media (max-width: 480px) {
          h1 { font-size: 20px !important; }
          h2 { font-size: 18px !important; }
        }
      `}</style>
    </div>
  );
}

// ─── Landing Styles ────────────────────────────────────────────────────────────

const landing = {
  outer: { padding: "0 16px 40px" },
  hero: {
    background: "linear-gradient(145deg,#1E3A8A 0%,#2563EB 60%,#3B82F6 100%)",
    borderRadius: 24,
    padding: "48px 32px 52px",
    textAlign: "center",
    maxWidth: 640,
    margin: "20px auto 0",
    boxShadow: "0 8px 32px rgba(37,99,235,0.35)",
    position: "relative",
    overflow: "hidden",
  },
  emblem: {
    width: 72,
    height: 72,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.15)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 16px",
    backdropFilter: "blur(4px)",
    border: "2px solid rgba(255,255,255,0.3)",
  },
  gov: {
    margin: "0 0 6px",
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    fontWeight: 600,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
  },
  org: {
    margin: "0 0 12px",
    fontSize: 22,
    fontWeight: 800,
    color: "#fff",
    lineHeight: 1.3,
  },
  tagline: {
    margin: "0 0 32px",
    fontSize: 14,
    color: "rgba(255,255,255,0.75)",
    letterSpacing: "0.04em",
  },
  cta: {
    padding: "16px 36px",
    fontSize: 16,
    fontWeight: 700,
    border: "none",
    borderRadius: 12,
    background: "#fff",
    color: "#1E3A8A",
    cursor: "pointer",
    boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
    letterSpacing: "0.02em",
  },
  timingsCard: {
    background: "#fff",
    borderRadius: 18,
    padding: "22px 24px",
    maxWidth: 640,
    margin: "16px auto 0",
    boxShadow: "0 4px 24px rgba(37,99,235,0.07)",
  },
  timingsHeading: {
    margin: "0 0 14px",
    fontWeight: 700,
    fontSize: 15,
    color: "#111827",
  },
  timingsGrid: { display: "flex", flexDirection: "column", gap: 10 },
  timingRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 14,
    color: "#374151",
    fontWeight: 500,
  },
  timingDot: (color) => ({
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: color === "green" ? "#22C55E" : "#F59E0B",
    flexShrink: 0,
  }),
};

// ─── Confirmation Styles ───────────────────────────────────────────────────────

const confirm = {
  banner: {
    background: "linear-gradient(135deg,#059669,#10B981)",
    borderRadius: 20,
    padding: "24px 24px",
    display: "flex",
    alignItems: "center",
    gap: 16,
    boxShadow: "0 6px 20px rgba(16,185,129,0.35)",
  },
  checkCircle: {
    width: 48,
    height: 48,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
    color: "#fff",
    fontWeight: 700,
    flexShrink: 0,
  },
  tokenCard: {
    textAlign: "center",
    background: "#EFF6FF",
    border: "2px dashed #BFDBFE",
    borderRadius: 16,
    padding: "22px 16px",
    marginTop: 16,
  },
  tokenLabel: {
    margin: "0 0 4px",
    fontSize: 11,
    fontWeight: 700,
    color: "#2563EB",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
  },
  tokenValue: {
    margin: 0,
    fontSize: 36,
    fontWeight: 900,
    color: "#1E3A8A",
    letterSpacing: "0.08em",
  },
  detailsCard: {
    background: "#fff",
    borderRadius: 20,
    padding: "22px 22px",
    marginTop: 16,
    boxShadow: "0 4px 24px rgba(37,99,235,0.07)",
  },
  sectionLabel: {
    margin: "0 0 16px",
    fontWeight: 700,
    fontSize: 13,
    color: "#2563EB",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  row: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    padding: "4px 0",
  },
  rowIcon: { fontSize: 18, marginTop: 2, flexShrink: 0 },
  rowLabel: { margin: 0, fontSize: 11, color: "#9CA3AF", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" },
  rowValue: { margin: "2px 0 0", fontSize: 15, color: "#111827", fontWeight: 600 },
  divider: { height: 1, background: "#F3F4F6", margin: "12px 0" },
  whatsapp: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 16,
    padding: "16px",
    background: "linear-gradient(135deg,#16A34A,#22C55E)",
    color: "#fff",
    borderRadius: 12,
    fontWeight: 700,
    fontSize: 15,
    textDecoration: "none",
    boxShadow: "0 4px 14px rgba(34,197,94,0.35)",
  },
};
