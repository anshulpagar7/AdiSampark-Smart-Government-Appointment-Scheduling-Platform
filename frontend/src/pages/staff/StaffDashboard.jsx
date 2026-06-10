export default function StaffDashboard() {
  return (
    <div
      style={{
        padding: "30px",
        background: "#f8fafc",
        minHeight: "100vh"
      }}
    >
      <h1>Staff Dashboard</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: "20px",
          marginTop: "20px"
        }}
      >
        <Card title="Appointments Today" value="48" />
        <Card title="Completed" value="21" />
        <Card title="Pending" value="22" />
        <Card title="Cancelled" value="5" />
      </div>

      <h2 style={{ marginTop: "40px" }}>
        Quick Actions
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2,1fr)",
          gap: "20px",
          marginTop: "20px"
        }}
      >
        <ActionCard text="View Appointments" />
        <ActionCard text="Schedule Appointment" />
        <ActionCard text="Add Holiday" />
        <ActionCard text="Generate Report" />
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div
      style={{
        background: "white",
        padding: "20px",
        borderRadius: "12px"
      }}
    >
      <h3>{title}</h3>
      <h1>{value}</h1>
    </div>
  );
}

function ActionCard({ text }) {
  return (
    <div
      style={{
        background: "white",
        padding: "25px",
        borderRadius: "12px",
        cursor: "pointer"
      }}
    >
      <h3>{text}</h3>
    </div>
  );
}