import { useState } from "react";

export default function CitizenBooking() {
  const [appointmentType, setAppointmentType] = useState(null);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Shabri</h1>

        <p style={styles.subtitle}>
          Smart Appointment Management System
        </p>

        <h2 style={styles.heading}>
          How would you like to book your appointment?
        </h2>

        <button
          style={styles.button}
          onClick={() => setAppointmentType("today")}
        >
          🏢 Book Appointment for Today
        </button>

        <button
          style={styles.button}
          onClick={() => setAppointmentType("future")}
        >
          📅 Book Future Appointment
        </button>

        {appointmentType && (
          <div style={styles.selection}>
            Selected:
            {" "}
            <strong>
              {appointmentType === "today"
                ? "Today's Appointment"
                : "Future Appointment"}
            </strong>
          </div>
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
    background: "#ffffff",
    borderRadius: "20px",
    padding: "30px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    textAlign: "center",
  },

  title: {
    marginBottom: "10px",
    color: "#1e3a8a",
  },

  subtitle: {
    color: "#666",
    marginBottom: "30px",
  },

  heading: {
    marginBottom: "20px",
    fontSize: "20px",
  },

  button: {
    width: "100%",
    padding: "16px",
    marginBottom: "15px",
    border: "none",
    borderRadius: "12px",
    background: "#2563eb",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  },

  selection: {
    marginTop: "20px",
    padding: "15px",
    background: "#eef4ff",
    borderRadius: "10px",
  },
};