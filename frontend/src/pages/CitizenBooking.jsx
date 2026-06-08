import { useState } from "react";

export default function CitizenBooking() {
  const [step, setStep] = useState(1);
  const [appointmentType, setAppointmentType] = useState("");
  const [selectedOfficer, setSelectedOfficer] = useState("");

  const officers = [
    "CEO Madam",
    "Scholarship Officer",
    "Education Officer",
    "Employment Officer",
  ];

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Shabri</h1>

        <p style={styles.subtitle}>
          Smart Appointment Management System
        </p>

        {step === 1 && (
          <>
            <h2 style={styles.heading}>
              How would you like to book?
            </h2>

            <button
              style={styles.primaryButton}
              onClick={() => {
                setAppointmentType("today");
                setStep(2);
              }}
            >
              🏢 Book Appointment for Today
            </button>

            <button
              style={styles.secondaryButton}
              onClick={() => {
                setAppointmentType("future");
                setStep(2);
              }}
            >
              📅 Book Future Appointment
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <button
              style={styles.backButton}
              onClick={() => setStep(1)}
            >
              ← Back
            </button>

            <h2 style={styles.heading}>Select Officer</h2>

            <div style={styles.infoBox}>
              Appointment Type:
              <strong>
                {" "}
                {appointmentType === "today"
                  ? "Today's Appointment"
                  : "Future Appointment"}
              </strong>
            </div>

            {officers.map((officer) => (
              <button
                key={officer}
                style={styles.officerButton}
                onClick={() => setSelectedOfficer(officer)}
              >
                {officer}
              </button>
            ))}

            {selectedOfficer && (
              <div style={styles.successBox}>
                Selected Officer:
                <strong> {selectedOfficer}</strong>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#f5f7fb",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },

  card: {
    width: "100%",
    maxWidth: "500px",
    background: "white",
    borderRadius: "20px",
    padding: "30px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
  },

  title: {
    textAlign: "center",
    color: "#1e3a8a",
    fontSize: "52px",
    marginBottom: "5px",
  },

  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: "30px",
  },

  heading: {
    textAlign: "center",
    color: "#222",
    marginBottom: "20px",
  },

  primaryButton: {
    width: "100%",
    padding: "16px",
    marginBottom: "15px",
    border: "none",
    borderRadius: "12px",
    background: "#2563eb",
    color: "white",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },

  secondaryButton: {
    width: "100%",
    padding: "16px",
    marginBottom: "15px",
    border: "2px solid #2563eb",
    borderRadius: "12px",
    background: "white",
    color: "#2563eb",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },

  officerButton: {
    width: "100%",
    padding: "15px",
    marginBottom: "12px",
    border: "1px solid #d1d5db",
    borderRadius: "12px",
    background: "#ffffff",
    color: "#111827",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
  },

  backButton: {
    border: "none",
    background: "transparent",
    color: "#2563eb",
    fontSize: "15px",
    cursor: "pointer",
    marginBottom: "20px",
  },

  infoBox: {
    padding: "12px",
    background: "#eef4ff",
    borderRadius: "10px",
    marginBottom: "20px",
    color: "#333",
  },

  successBox: {
    marginTop: "20px",
    padding: "14px",
    background: "#dcfce7",
    borderRadius: "10px",
    color: "#166534",
    textAlign: "center",
  },
};