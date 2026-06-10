export default function Reports() {
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
        <h1
          style={{
            color: "#111827",
            marginBottom: "10px",
          }}
        >
          Reports & Analytics
        </h1>

        <p
          style={{
            color: "#64748B",
            marginBottom: "30px",
          }}
        >
          Appointment insights and performance statistics.
        </p>

        {/* KPI CARDS */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(250px,1fr))",
            gap: "20px",
          }}
        >
          <Card
            title="Appointments Today"
            value="48"
            color="#2563EB"
          />

          <Card
            title="Completed"
            value="21"
            color="#22C55E"
          />

          <Card
            title="Waiting"
            value="18"
            color="#F59E0B"
          />

          <Card
            title="No Shows"
            value="3"
            color="#EF4444"
          />
        </div>

        {/* CHARTS ROW */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          {/* Pie Chart */}

          <div style={card}>
            <h2>
              Appointment Status
            </h2>

            <div
              style={{
                width: "220px",
                height: "220px",
                borderRadius: "50%",
                margin: "30px auto",
                background:
                  "conic-gradient(#22C55E 0% 45%, #F59E0B 45% 83%, #EF4444 83% 90%, #2563EB 90% 100%)",
              }}
            />

            <div
              style={{
                display: "grid",
                gap: "10px",
              }}
            >
              <Legend
                color="#22C55E"
                label="Completed (45%)"
              />

              <Legend
                color="#F59E0B"
                label="Waiting (38%)"
              />

              <Legend
                color="#EF4444"
                label="No Show (7%)"
              />

              <Legend
                color="#2563EB"
                label="Approved (10%)"
              />
            </div>
          </div>

          {/* Monthly Trend */}

          <div style={card}>
            <h2>
              Monthly Appointments
            </h2>

            <div
              style={{
                marginTop: "30px",
              }}
            >
              <Bar
                label="Jan"
                value={60}
              />

              <Bar
                label="Feb"
                value={75}
              />

              <Bar
                label="Mar"
                value={70}
              />

              <Bar
                label="Apr"
                value={85}
              />

              <Bar
                label="May"
                value={95}
              />

              <Bar
                label="Jun"
                value={100}
              />
            </div>
          </div>
        </div>

        {/* PURPOSE ANALYTICS */}

        <div
          style={{
            ...card,
            marginTop: "30px",
          }}
        >
          <h2>
            Purpose Analytics
          </h2>

          <Progress
            label="Scholarship"
            value={85}
          />

          <Progress
            label="Education"
            value={72}
          />

          <Progress
            label="Employment"
            value={55}
          />

          <Progress
            label="Certificate"
            value={40}
          />

          <Progress
            label="Complaint"
            value={22}
          />
        </div>

        {/* REPORT ACTIONS */}

        <div
          style={{
            ...card,
            marginTop: "30px",
            textAlign: "center",
          }}
        >
          <h2>
            Export Reports
          </h2>

          <p
            style={{
              color: "#64748B",
            }}
          >
            Download appointment reports
            and analytics.
          </p>

          <button
            onClick={() =>
              alert(
                "Report Exported Successfully"
              )
            }
            style={{
              background: "#2563EB",
              color: "white",
              border: "none",
              padding: "15px 25px",
              borderRadius: "12px",
              marginTop: "15px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
}

function Card({
  title,
  value,
  color,
}) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "20px",
        padding: "25px",
        boxShadow:
          "0 10px 30px rgba(0,0,0,0.08)",
        borderTop:
          `5px solid ${color}`,
      }}
    >
      <p
        style={{
          color: "#64748B",
        }}
      >
        {title}
      </p>

      <h1>{value}</h1>
    </div>
  );
}

function Legend({
  color,
  label,
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <div
        style={{
          width: "15px",
          height: "15px",
          borderRadius: "50%",
          background: color,
        }}
      />

      {label}
    </div>
  );
}

function Bar({
  label,
  value,
}) {
  return (
    <div
      style={{
        marginBottom: "18px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          marginBottom: "5px",
        }}
      >
        <span>{label}</span>
        <span>{value}</span>
      </div>

      <div
        style={{
          background: "#E2E8F0",
          height: "10px",
          borderRadius: "10px",
        }}
      >
        <div
          style={{
            width: `${value}%`,
            background: "#2563EB",
            height: "10px",
            borderRadius: "10px",
          }}
        />
      </div>
    </div>
  );
}

function Progress({
  label,
  value,
}) {
  return (
    <div
      style={{
        marginTop: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
        }}
      >
        <span>{label}</span>
        <span>{value}</span>
      </div>

      <div
        style={{
          background: "#E2E8F0",
          height: "12px",
          borderRadius: "12px",
          marginTop: "8px",
        }}
      >
        <div
          style={{
            width: `${value}%`,
            height: "12px",
            background: "#2563EB",
            borderRadius: "12px",
          }}
        />
      </div>
    </div>
  );
}

const card = {
  background: "white",
  borderRadius: "20px",
  padding: "25px",
  boxShadow:
    "0 10px 30px rgba(0,0,0,0.08)",
};