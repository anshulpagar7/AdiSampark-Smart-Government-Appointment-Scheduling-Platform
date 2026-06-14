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
    <div
      style={{
        minHeight: "100vh",
        background: "#F8FAFC",
      }}
    >
      {/* Header */}

      <div
        style={{
          background: "white",
          padding: "20px 30px",
          borderBottom: "1px solid #E5E7EB",
          display: "flex",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <img
          src={tribalLogo}
          alt="Logo"
          style={{
            width: "75px",
            height: "75px",
            objectFit: "contain",
          }}
        />

        <div>
          <h2
            style={{
              margin: 0,
              color: "#111827",
            }}
          >
            Maharashtra State Cooperative Tribal Development Corporation Limited
          </h2>

          <p
            style={{
              marginTop: "6px",
              color: "#64748B",
            }}
          >
            Managing Director Dashboard
          </p>
        </div>
      </div>

      <div
        style={{
          padding: "35px",
        }}
      >
        {/* Welcome */}

        <div
          style={{
            marginBottom: "30px",
          }}
        >
          <h1
            style={{
              fontSize: "48px",
              marginBottom: "10px",
              color: "#0F172A",
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
            Executive Monitoring Dashboard
          </p>
        </div>

        {/* Stats */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          <StatCard
            title="Today's Citizens"
            value="18"
            gradient="linear-gradient(135deg,#3B82F6,#2563EB)"
          />

          <StatCard
            title="Waiting"
            value="4"
            gradient="linear-gradient(135deg,#F59E0B,#D97706)"
          />

          <StatCard
            title="Meetings"
            value="3"
            gradient="linear-gradient(135deg,#10B981,#059669)"
          />

          <StatCard
            title="Completed"
            value="12"
            gradient="linear-gradient(135deg,#8B5CF6,#7C3AED)"
          />
        </div>

        {/* Current + Next Citizen */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginBottom: "25px",
          }}
        >
          <div style={card}>
            <h3
              style={{
                color: "#2563EB",
                marginBottom: "20px",
              }}
            >
              CURRENTLY MEETING
            </h3>

            <h1
              style={{
                marginBottom: "10px",
              }}
            >
              Rahul Sharma
            </h1>

            <h1
              style={{
                fontSize: "60px",
                color: "#2563EB",
                marginBottom: "15px",
              }}
            >
              #1001
            </h1>

            <p>
              <strong>Purpose:</strong> Scholarship Query
            </p>

            <p>
              <strong>Time:</strong> 11:00 AM
            </p>
          </div>

          <div style={card}>
            <h3
              style={{
                color: "#10B981",
                marginBottom: "20px",
              }}
            >
              NEXT CITIZEN
            </h3>

            <h1
              style={{
                marginBottom: "10px",
              }}
            >
              Priya Patil
            </h1>

            <h1
              style={{
                fontSize: "60px",
                color: "#10B981",
                marginBottom: "15px",
              }}
            >
              #1002
            </h1>

            <p>
              <strong>Purpose:</strong> Education Support
            </p>

            <p>
              <strong>Time:</strong> 11:10 AM
            </p>
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

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            {executiveMeetings.map((meeting, index) => (
              <div
                key={index}
                style={{
                  background: "#F1F5F9",
                  padding: "20px",
                  borderRadius: "16px",
                }}
              >
                <h3>{meeting.title}</h3>

                <p>
                  <strong>Meeting With:</strong> {meeting.with}
                </p>

                <p>
                  <strong>Time:</strong> {meeting.time}
                </p>

                <p>
                  <strong>Mode:</strong> {meeting.mode}
                </p>

                <button
                  style={{
                    background: "#10B981",
                    color: "white",
                    border: "none",
                    padding: "10px 18px",
                    borderRadius: "10px",
                    cursor: "pointer",
                  }}
                >
                  Join Meeting
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Focus + Upcoming */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "350px 1fr",
            gap: "20px",
          }}
        >
          <div style={card}>
            <h2>Today's Focus</h2>

            <div
              style={{
                marginTop: "25px",
              }}
            >
              <FocusItem title="Citizens Waiting" value="4" />

              <FocusItem title="Meetings Today" value="3" />

              <FocusItem title="Completed Citizens" value="12" />
            </div>
          </div>

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
                {upcomingCitizens.map((citizen, index) => (
                  <tr key={index}>
                    <td style={td}>{citizen.token}</td>

                    <td style={td}>{citizen.name}</td>

                    <td style={td}>{citizen.purpose}</td>

                    <td style={td}>{citizen.time}</td>
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

function StatCard({ title, value, gradient }) {
  return (
    <div
      style={{
        background: gradient,
        color: "white",
        borderRadius: "22px",
        padding: "25px",
      }}
    >
      <p>{title}</p>

      <h1
        style={{
          fontSize: "48px",
          marginTop: "10px",
        }}
      >
        {value}
      </h1>
    </div>
  );
}

function FocusItem({ title, value }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "14px 0",
        borderBottom: "1px solid #E5E7EB",
      }}
    >
      <span>{title}</span>

      <strong>{value}</strong>
    </div>
  );
}

const card = {
  background: "white",
  borderRadius: "22px",
  padding: "25px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
};

const th = {
  textAlign: "left",
  paddingBottom: "15px",
  color: "#64748B",
};

const td = {
  padding: "14px 0",
  borderBottom: "1px solid #E5E7EB",
};