export default function Appointments() {
  const appointments = [
    {
      id: "SHA-1001",
      name: "Rahul Sharma",
      mobile: "9876543210",
      officer: "Leena Bansod Madam",
      purpose: "Scholarship",
      time: "09:00 AM",
      status: "Pending"
    },
    {
      id: "SHA-1002",
      name: "Priya Patil",
      mobile: "9876543211",
      officer: "Leena Bansod Madam",
      purpose: "Certificate",
      time: "09:10 AM",
      status: "Approved"
    },
    {
      id: "SHA-1003",
      name: "Amit Kumar",
      mobile: "9876543212",
      officer: "Anshul Pagar",
      purpose: "Employment",
      time: "09:20 AM",
      status: "Completed"
    },
    {
      id: "SHA-1004",
      name: "Sneha Joshi",
      mobile: "9876543213",
      officer: "Leena Bansod Madam",
      purpose: "Education",
      time: "09:30 AM",
      status: "Pending"
    }
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f8fafc",
        padding: "30px"
      }}
    >
      <h1>Appointments Management</h1>

      <p
        style={{
          color: "#666",
          marginBottom: "25px"
        }}
      >
        Manage citizen appointments and queue status.
      </p>

      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "20px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
          overflowX: "auto"
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse"
          }}
        >
          <thead>
            <tr
              style={{
                background: "#f1f5f9"
              }}
            >
              <th style={tableHeader}>ID</th>
              <th style={tableHeader}>Name</th>
              <th style={tableHeader}>Mobile</th>
              <th style={tableHeader}>Officer</th>
              <th style={tableHeader}>Purpose</th>
              <th style={tableHeader}>Time</th>
              <th style={tableHeader}>Status</th>
              <th style={tableHeader}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td style={tableCell}>{appointment.id}</td>
                <td style={tableCell}>{appointment.name}</td>
                <td style={tableCell}>{appointment.mobile}</td>
                <td style={tableCell}>{appointment.officer}</td>
                <td style={tableCell}>{appointment.purpose}</td>
                <td style={tableCell}>{appointment.time}</td>

                <td style={tableCell}>
                  <span
                    style={{
                      padding: "6px 12px",
                      borderRadius: "20px",
                      background:
                        appointment.status === "Completed"
                          ? "#dcfce7"
                          : appointment.status === "Approved"
                          ? "#dbeafe"
                          : "#fef3c7",
                      color:
                        appointment.status === "Completed"
                          ? "#166534"
                          : appointment.status === "Approved"
                          ? "#1d4ed8"
                          : "#92400e",
                      fontWeight: "600"
                    }}
                  >
                    {appointment.status}
                  </span>
                </td>

                <td style={tableCell}>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      flexWrap: "wrap"
                    }}
                  >
                    <button style={approveBtn}>
                      Approve
                    </button>

                    <button style={completeBtn}>
                      Complete
                    </button>

                    <button style={noShowBtn}>
                      No Show
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const tableHeader = {
  padding: "12px",
  textAlign: "left",
  borderBottom: "1px solid #ddd"
};

const tableCell = {
  padding: "12px",
  borderBottom: "1px solid #eee"
};

const approveBtn = {
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "8px",
  cursor: "pointer"
};

const completeBtn = {
  background: "#16a34a",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "8px",
  cursor: "pointer"
};

const noShowBtn = {
  background: "#dc2626",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "8px",
  cursor: "pointer"
};