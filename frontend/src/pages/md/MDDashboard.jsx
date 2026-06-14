export default function MDDashboard() {
  const meetings = [
    {
      title: "Head Office Review Meeting",
      with: "Tribal Development Head Office",
      time: "2:00 PM",
      status: "Upcoming",
      mode: "Google Meet",
    },
    {
      title: "Regional Officer Discussion",
      with: "Regional Office",
      time: "4:00 PM",
      status: "Upcoming",
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
    <div
      style={{
        background: "#F8FAFC",
        minHeight: "100vh",
        padding: "35px",
      }}
    >
      {/* Header */}

      <div style={{ marginBottom: "30px" }}>
        <h1
          style={{
            fontSize: "42px",
            color: "#0F172A",
            marginBottom: "8px",
          }}
        >
          Good Morning, Madam 🌿
        </h1>

        <p
          style={{
            color: "#64748B",
            fontSize: "18px",
          }}
        >
          Managing Director Dashboard
        </p>
      </div>

      {/* Statistics */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
          marginBottom: "25px",
        }}
      >
        <StatCard
          title="Today's Citizens"
          value="18"
          color="linear-gradient(135deg,#3B82F6,#2563EB)"
        />

        <StatCard
          title="Waiting"
          value="4"
          color="linear-gradient(135deg,#F59E0B,#D97706)"
        />

        <StatCard
          title="Meetings"
          value="3"
          color="linear-gradient(135deg,#10B981,#059669)"
        />

        <StatCard
          title="Completed"
          value="12"
          color="linear-gradient(135deg,#8B5CF6,#7C3AED)"
        />
      </div>

      {/* Main Section */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "25px",
          marginBottom: "25px",
        }}
      >
        {/* Current Citizen */}

        <div style={card}>
          <div
            style={{
              color: "#2563EB",
              fontWeight: "700",
              marginBottom: "15px",
            }}
          >
            CURRENTLY MEETING
          </div>

          <h2
            style={{
              fontSize: "34px",
            }}
          >
            Rahul Sharma
          </h2>

          <div
            style={{
              fontSize: "60px",
              fontWeight: "700",
              color: "#2563EB",
              margin: "10px 0",
            }}
          >
            #1001
          </div>

          <p>
            <strong>Purpose:</strong> Scholarship Query
          </p>

          <p>
            <strong>Time:</strong> 11:00 AM
          </p>

          <button
            style={{
              marginTop: "20px",
              background: "#10B981",
              color: "white",
              border: "none",
              padding: "12px 18px",
              borderRadius: "12px",
              cursor: "pointer",
            }}
          >
            Meeting Active
          </button>
        </div>

        {/* Today's Focus */}

        <div style={card}>
          <h2>Today's Focus</h2>

          <div style={{ marginTop: "20px" }}>
            <FocusItem
              title="Citizens Waiting"
              value="4"
            />

            <FocusItem
              title="Executive Meetings"
              value="3"
            />

            <FocusItem
              title="Pending Actions"
              value="2"
            />
          </div>
        </div>
      </div>

      {/* Executive Meetings */}

      <div
        style={{
          ...card,
          marginBottom: "25px",
        }}
      >
        <h2
          style={{
            marginBottom: "20px",
          }}
        >
          Executive Meetings
        </h2>

        {meetings.map((meeting, index) => (
          <div
            key={index}
            style={{
              background: "#F1F5F9",
              borderRadius: "14px",
              padding: "18px",
              marginBottom: "15px",
            }}
          >
            <h3>{meeting.title}</h3>

            <p>
              <strong>Meeting With:</strong>{" "}
              {meeting.with}
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

            <button style={joinBtn}>
              Join Meeting
            </button>
          </div>
        ))}
      </div>

      {/* Upcoming Citizens */}

      <div style={card}>
        <h2
          style={{
            marginBottom: "20px",
          }}
        >
          Upcoming Citizens
        </h2>

        <table
          style={{
            width: "100%",
          }}
        >
          <thead>
            <tr>
              <th style={th}>Token</th>
              <th style={th}>Citizen</th>
              <th style={th}>Purpose</th>
              <th style={th}>Time</th>
            </tr>
          </thead>

          <tbody>
            {upcomingCitizens.map(
              (citizen, index) => (
                <tr key={index}>
                  <td style={td}>
                    {citizen.token}
                  </td>

                  <td style={td}>
                    {citizen.name}
                  </td>

                  <td style={td}>
                    {citizen.purpose}
                  </td>

                  <td style={td}>
                    {citizen.time}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  color,
}) {
  return (
    <div
      style={{
        background: color,
        color: "white",
        padding: "24px",
        borderRadius: "22px",
        boxShadow:
          "0 10px 25px rgba(0,0,0,0.1)",
      }}
    >
      <p>{title}</p>

      <h1
        style={{
          fontSize: "42px",
          marginTop: "10px",
        }}
      >
        {value}
      </h1>
    </div>
  );
}

function FocusItem({
  title,
  value,
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent:
          "space-between",
        padding: "14px 0",
        borderBottom:
          "1px solid #E2E8F0",
      }}
    >
      <span>{title}</span>
      <strong>{value}</strong>
    </div>
  );
}

const card = {
  background: "white",
  borderRadius: "24px",
  padding: "25px",
  boxShadow:
    "0 10px 30px rgba(0,0,0,0.08)",
};

const th = {
  textAlign: "left",
  paddingBottom: "15px",
  color: "#475569",
};

const td = {
  padding: "14px 0",
  borderBottom:
    "1px solid #E2E8F0",
};

const joinBtn = {
  background: "#10B981",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: "10px",
  cursor: "pointer",
  marginTop: "10px",
};