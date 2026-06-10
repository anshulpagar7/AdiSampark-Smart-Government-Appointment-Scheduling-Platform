export default function StaffDashboard() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F8FAFC",
        color: "#111827",
        padding: "40px"
      }}
    >
      {/* Header */}
      <div
        style={{
          marginBottom: "30px"
        }}
      >
        <h1
          style={{
            fontSize: "42px",
            marginBottom: "8px"
          }}
        >
          Good Morning 👋
        </h1>

        <p
          style={{
            color: "#64748B",
            fontSize: "18px"
          }}
        >
          Welcome to Shabri Staff Portal
        </p>
      </div>

      {/* KPI CARDS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px"
        }}
      >
        <StatCard
          title="Appointments Today"
          value="48"
          color="#2563EB"
        />

        <StatCard
          title="Waiting"
          value="18"
          color="#F59E0B"
        />

        <StatCard
          title="Completed"
          value="21"
          color="#22C55E"
        />

        <StatCard
          title="No Shows"
          value="3"
          color="#EF4444"
        />
      </div>

      {/* QUEUE + EVENTS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "20px",
          marginTop: "30px"
        }}
      >
        {/* Queue Card */}

        <div style={card}>
          <p
            style={{
              color: "#64748B",
              marginBottom: "10px"
            }}
          >
            CURRENT QUEUE
          </p>

          <h1
            style={{
              fontSize: "64px",
              color: "#2563EB",
              margin: 0
            }}
          >
            #12
          </h1>

          <div
            style={{
              marginTop: "20px"
            }}
          >
            <p>
              Currently Serving:
              <strong>
                {" "}Rahul Sharma
              </strong>
            </p>

            <p>
              Waiting Visitors:
              <strong>
                {" "}18
              </strong>
            </p>
          </div>
        </div>

        {/* Events */}

        <div style={card}>
          <h2>Upcoming Events</h2>

          <EventCard
            title="Scholarship Camp"
            date="12 June 2026"
          />

          <EventCard
            title="Tribal Welfare Drive"
            date="18 June 2026"
          />

          <EventCard
            title="Education Workshop"
            date="22 June 2026"
          />
        </div>
      </div>

      {/* TODAY'S APPOINTMENTS */}

      <div
        style={{
          ...card,
          marginTop: "30px"
        }}
      >
        <h2
          style={{
            marginBottom: "20px"
          }}
        >
          Today's Appointments
        </h2>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse"
          }}
        >
          <thead>
            <tr>
              <th style={th}>Name</th>
              <th style={th}>Purpose</th>
              <th style={th}>Time</th>
              <th style={th}>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td style={td}>Rahul Sharma</td>
              <td style={td}>Scholarship</td>
              <td style={td}>09:00 AM</td>
              <td style={td}>
                <Status color="#2563EB">
                  Approved
                </Status>
              </td>
            </tr>

            <tr>
              <td style={td}>Priya Patil</td>
              <td style={td}>Certificate</td>
              <td style={td}>09:10 AM</td>
              <td style={td}>
                <Status color="#F59E0B">
                  Waiting
                </Status>
              </td>
            </tr>

            <tr>
              <td style={td}>Amit Kumar</td>
              <td style={td}>Employment</td>
              <td style={td}>09:20 AM</td>
              <td style={td}>
                <Status color="#22C55E">
                  Completed
                </Status>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  color
}) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "20px",
        padding: "25px",
        boxShadow:
          "0 10px 30px rgba(0,0,0,0.08)",
        borderTop: `5px solid ${color}`
      }}
    >
      <p
        style={{
          color: "#64748B"
        }}
      >
        {title}
      </p>

      <h1
        style={{
          margin: 0
        }}
      >
        {value}
      </h1>
    </div>
  );
}

function EventCard({
  title,
  date
}) {
  return (
    <div
      style={{
        background: "#F8FAFC",
        padding: "12px",
        borderRadius: "12px",
        marginBottom: "10px"
      }}
    >
      <strong>{title}</strong>

      <p
        style={{
          margin: "5px 0 0",
          color: "#64748B"
        }}
      >
        {date}
      </p>
    </div>
  );
}

function Status({
  children,
  color
}) {
  return (
    <span
      style={{
        background: color,
        color: "white",
        padding: "6px 12px",
        borderRadius: "20px",
        fontSize: "14px"
      }}
    >
      {children}
    </span>
  );
}

const card = {
  background: "white",
  borderRadius: "20px",
  padding: "25px",
  boxShadow:
    "0 10px 30px rgba(0,0,0,0.08)"
};

const th = {
  textAlign: "left",
  paddingBottom: "15px",
  borderBottom: "1px solid #E2E8F0"
};

const td = {
  padding: "15px 0",
  borderBottom: "1px solid #F1F5F9"
};