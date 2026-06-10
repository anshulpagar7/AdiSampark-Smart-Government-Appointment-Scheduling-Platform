import { useState } from "react";

export default function HolidayManagement() {
  const [holiday, setHoliday] = useState({
    date: "",
    reason: "",
    type: "Full Day",
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    setHoliday({
      ...holiday,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    if (!holiday.date || !holiday.reason) {
      alert("Please fill all fields");
      return;
    }

    setSaved(true);
  };

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
        <h1
          style={{
            color: "#111827",
            marginBottom: "10px",
          }}
        >
          Holiday Management
        </h1>

        <p
          style={{
            color: "#64748B",
            marginBottom: "30px",
          }}
        >
          Configure office holidays and half-day schedules.
        </p>

        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "30px",
            boxShadow:
              "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          <h2>Add Holiday</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(280px,1fr))",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            <div>
              <label>Date</label>

              <input
                type="date"
                name="date"
                value={holiday.date}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>

            <div>
              <label>Reason</label>

              <input
                name="reason"
                value={holiday.reason}
                onChange={handleChange}
                placeholder="Public Holiday"
                style={inputStyle}
              />
            </div>
          </div>

          <div
            style={{
              marginTop: "25px",
            }}
          >
            <label>
              Holiday Type
            </label>

            <div
              style={{
                display: "flex",
                gap: "15px",
                marginTop: "15px",
              }}
            >
              <button
                onClick={() =>
                  setHoliday({
                    ...holiday,
                    type: "Full Day",
                  })
                }
                style={{
                  ...typeButton,
                  background:
                    holiday.type ===
                    "Full Day"
                      ? "#2563EB"
                      : "white",

                  color:
                    holiday.type ===
                    "Full Day"
                      ? "white"
                      : "#111827",
                }}
              >
                Full Day
              </button>

              <button
                onClick={() =>
                  setHoliday({
                    ...holiday,
                    type: "Half Day",
                  })
                }
                style={{
                  ...typeButton,
                  background:
                    holiday.type ===
                    "Half Day"
                      ? "#2563EB"
                      : "white",

                  color:
                    holiday.type ===
                    "Half Day"
                      ? "white"
                      : "#111827",
                }}
              >
                Half Day
              </button>
            </div>
          </div>

          <button
            onClick={handleSave}
            style={{
              marginTop: "30px",
              background: "#2563EB",
              color: "white",
              border: "none",
              padding: "15px 25px",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "600",
            }}
          >
            Save Holiday
          </button>
        </div>

        {saved && (
          <div
            style={{
              marginTop: "25px",
              background: "#DCFCE7",
              borderRadius: "20px",
              padding: "25px",
              border:
                "1px solid #22C55E",
            }}
          >
            <h2>
              ✅ Holiday Saved
            </h2>

            <p>
              {holiday.date}
            </p>

            <p>
              {holiday.reason}
            </p>

            <p>
              {holiday.type}
            </p>
          </div>
        )}

        <div
          style={{
            background: "white",
            borderRadius: "20px",
            padding: "30px",
            marginTop: "30px",
            boxShadow:
              "0 10px 30px rgba(0,0,0,0.08)",
          }}
        >
          <h2>
            Upcoming Holidays
          </h2>

          <table
            style={{
              width: "100%",
              marginTop: "20px",
            }}
          >
            <thead>
              <tr>
                <th style={th}>
                  Date
                </th>

                <th style={th}>
                  Reason
                </th>

                <th style={th}>
                  Type
                </th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td style={td}>
                  15 Aug 2026
                </td>

                <td style={td}>
                  Independence Day
                </td>

                <td style={td}>
                  Full Day
                </td>
              </tr>

              <tr>
                <td style={td}>
                  2 Oct 2026
                </td>

                <td style={td}>
                  Gandhi Jayanti
                </td>

                <td style={td}>
                  Full Day
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginTop: "8px",
  borderRadius: "12px",
  border: "1px solid #CBD5E1",
  boxSizing: "border-box",
};

const typeButton = {
  padding: "14px 24px",
  borderRadius: "12px",
  border: "1px solid #CBD5E1",
  cursor: "pointer",
};

const th = {
  textAlign: "left",
  paddingBottom: "15px",
};

const td = {
  padding: "15px 0",
};