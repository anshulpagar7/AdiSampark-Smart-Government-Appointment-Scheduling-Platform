export default function ExecutiveMeetings() {
  const meetings = [
    {
      title: "Head Office Review Meeting",
      with: "Head Office",
      date: "20 June 2026",
      time: "2:00 PM",
      mode: "Google Meet",
      status: "Upcoming",
    },
    {
      title: "Regional Officer Discussion",
      with: "Regional Office",
      date: "21 June 2026",
      time: "4:00 PM",
      mode: "Physical",
      status: "Upcoming",
    },
  ];

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
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <h1>Executive Meetings</h1>

        <p
          style={{
            color: "#64748B",
            marginBottom: "30px",
          }}
        >
          Meetings scheduled by the Managing Director.
        </p>

        <div
          style={{
            display: "grid",
            gap: "20px",
          }}
        >
          {meetings.map((meeting, index) => (
            <div
              key={index}
              style={{
                background: "white",
                borderRadius: "20px",
                padding: "25px",
                boxShadow:
                  "0 10px 30px rgba(0,0,0,0.08)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <h2>{meeting.title}</h2>

                  <p>
                    <strong>Meeting With:</strong>{" "}
                    {meeting.with}
                  </p>

                  <p>
                    <strong>Date:</strong>{" "}
                    {meeting.date}
                  </p>

                  <p>
                    <strong>Time:</strong>{" "}
                    {meeting.time}
                  </p>

                  <p>
                    <strong>Mode:</strong>{" "}
                    {meeting.mode}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    {meeting.status}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  <button style={primaryBtn}>
                    View Details
                  </button>

                  <button style={successBtn}>
                    Mark Completed
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const primaryBtn = {
  background: "#2563EB",
  color: "white",
  border: "none",
  padding: "12px 18px",
  borderRadius: "12px",
  cursor: "pointer",
};

const successBtn = {
  background: "#22C55E",
  color: "white",
  border: "none",
  padding: "12px 18px",
  borderRadius: "12px",
  cursor: "pointer",
};