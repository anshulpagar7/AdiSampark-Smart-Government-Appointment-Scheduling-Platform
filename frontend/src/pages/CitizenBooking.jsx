import { useState } from "react";

export default function CitizenBooking() {
  const [step, setStep] = useState(1);

  const [appointmentType, setAppointmentType] = useState("");
  const [selectedOfficer, setSelectedOfficer] = useState("");
  const [purpose, setPurpose] = useState("");

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [notes, setNotes] = useState("");

  const officers = [
    "CEO Madam",
    "Scholarship Officer",
    "Education Officer",
    "Employment Officer",
  ];

  const purposes = [
    "Scholarship",
    "Education",
    "Employment",
    "Certificate",
    "Complaint",
    "Other",
  ];

  const appointmentId =
    "SHA-" + Math.floor(1000 + Math.random() * 9000);

  const queuePosition =
    Math.floor(Math.random() * 20) + 1;

  const estimatedWait = queuePosition * 10;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Shabri</h1>

        <p style={styles.subtitle}>
          Smart Appointment Management System
        </p>

        {/* STEP 1 */}
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

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <button
              style={styles.backButton}
              onClick={() => setStep(1)}
            >
              ← Back
            </button>

            <h2 style={styles.heading}>
              Select Officer
            </h2>

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
                style={styles.optionButton}
                onClick={() => {
                  setSelectedOfficer(officer);
                  setStep(3);
                }}
              >
                {officer}
              </button>
            ))}
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <button
              style={styles.backButton}
              onClick={() => setStep(2)}
            >
              ← Back
            </button>

            <h2 style={styles.heading}>
              Select Purpose
            </h2>

            {purposes.map((item) => (
              <button
                key={item}
                style={styles.optionButton}
                onClick={() => {
                  setPurpose(item);
                  setStep(4);
                }}
              >
                {item}
              </button>
            ))}
          </>
        )}

        {/* STEP 4 */}
        {step === 4 && (
          <>
            <button
              style={styles.backButton}
              onClick={() => setStep(3)}
            >
              ← Back
            </button>

            <h2 style={styles.heading}>
              Enter Details
            </h2>

            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
            />

            <input
              type="text"
              placeholder="Mobile Number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              style={styles.input}
            />

            <textarea
              placeholder="Additional Notes (Optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={styles.textarea}
            />

            <button
              style={styles.primaryButton}
              onClick={() => {
                if (!name || !mobile) {
                  alert("Please fill all required fields");
                  return;
                }

                setStep(5);
              }}
            >
              Confirm Appointment
            </button>
          </>
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <>
            <h2 style={styles.heading}>
              🎉 Appointment Confirmed
            </h2>

            <div style={styles.successBox}>
              <p>
                <strong>Appointment ID:</strong>{" "}
                {appointmentId}
              </p>

              <p>
                <strong>Officer:</strong>{" "}
                {selectedOfficer}
              </p>

              <p>
                <strong>Purpose:</strong>{" "}
                {purpose}
              </p>

              <p>
                <strong>Name:</strong> {name}
              </p>

              <p>
                <strong>Queue Position:</strong> #
                {queuePosition}
              </p>

              <p>
                <strong>Estimated Wait:</strong>{" "}
                {estimatedWait} mins
              </p>
            </div>

            <button
              style={styles.primaryButton}
              onClick={() => window.location.reload()}
            >
              Book Another Appointment
            </button>
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

  optionButton: {
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

  input: {
    width: "100%",
    padding: "14px",
    marginBottom: "12px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "15px",
  },

  textarea: {
    width: "100%",
    minHeight: "100px",
    padding: "14px",
    marginBottom: "15px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "15px",
    resize: "vertical",
  },

  infoBox: {
    padding: "12px",
    background: "#eef4ff",
    borderRadius: "10px",
    marginBottom: "20px",
    color: "#333",
  },

  successBox: {
    background: "#dcfce7",
    color: "#166534",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "20px",
    lineHeight: "1.8",
  },
};