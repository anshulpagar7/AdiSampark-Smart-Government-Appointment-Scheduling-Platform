export default function Appointments() {
  const appointments = [
    {
      id: "SHA-1001",
      name: "Rahul Sharma",
      time: "09:00 AM",
      status: "Pending"
    },
    {
      id: "SHA-1002",
      name: "Priya Patil",
      time: "09:10 AM",
      status: "Approved"
    },
    {
      id: "SHA-1003",
      name: "Amit Kumar",
      time: "09:20 AM",
      status: "Completed"
    }
  ];

  return (
    <div
      style={{
        padding: "30px"
      }}
    >
      <h1>Appointments</h1>

      <table
        style={{
          width: "100%",
          marginTop: "20px",
          borderCollapse: "collapse"
        }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td>{appointment.id}</td>
              <td>{appointment.name}</td>
              <td>{appointment.time}</td>
              <td>{appointment.status}</td>

              <td>
                <button>Approve</button>
                <button>Complete</button>
                <button>No Show</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}