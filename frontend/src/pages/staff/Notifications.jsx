export default function Notifications() {
  return (
    <div
      style={{
        background: "#F8FAFC",
        minHeight: "100vh",
        padding: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <h1>Notifications</h1>

        <p
          style={{
            color: "#64748B",
            marginBottom: "25px",
          }}
        >
          Send appointment notifications
          and reminders.
        </p>

        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "20px",
            boxShadow:
              "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          <h2>
            WhatsApp Preview
          </h2>

          <div
            style={{
              background: "#DCFCE7",
              padding: "20px",
              borderRadius: "12px",
              marginTop: "15px",
            }}
          >
            <p>
              Hello Rahul Sharma,
            </p>

            <p>
              Your appointment with
              Leena Bansod
              (Managing Director)
              has been confirmed.
            </p>

            <p>
              Token: SHA-1001
            </p>

            <p>
              Time: 11:00 AM
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "20px",
              flexWrap: "wrap",
            }}
          >
            <button
              style={btn}
              onClick={() =>
                alert(
                  "Confirmation Sent"
                )
              }
            >
              Send Confirmation
            </button>

            <button
              style={btn}
              onClick={() =>
                alert(
                  "Reminder Sent"
                )
              }
            >
              Send Reminder
            </button>

            <button
              style={btn}
              onClick={() =>
                alert(
                  "Queue Update Sent"
                )
              }
            >
              Send Queue Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const btn = {
  background: "#2563EB",
  color: "white",
  border: "none",
  padding: "12px 18px",
  borderRadius: "12px",
  cursor: "pointer",
};