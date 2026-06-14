import { useState } from "react";

export default function QueueManagement() {
  const [currentToken, setCurrentToken] =
    useState("SHA-1001");

  const [currentCitizen, setCurrentCitizen] =
    useState("Rahul Sharma");

  const waitingQueue = [
    {
      token: "SHA-1002",
      name: "Priya Patil",
      purpose: "Education Support"
    },
    {
      token: "SHA-1003",
      name: "Amit Kumar",
      purpose: "Certificate Verification"
    },
    {
      token: "SHA-1004",
      name: "Sneha More",
      purpose: "Scholarship Query"
    }
  ];

  return (
    <div
      style={{
        background: "#F8FAFC",
        minHeight: "100vh",
        padding: "40px"
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto"
        }}
      >
        <h1
          style={{
            marginBottom: "10px"
          }}
        >
          Queue Management
        </h1>

        <p
          style={{
            color: "#64748B",
            marginBottom: "30px"
          }}
        >
          Manage appointment queue
          and visitor flow.
        </p>

        {/* Top Cards */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(250px,1fr))",
            gap: "20px"
          }}
        >
          <Card
            title="Current Token"
            value={currentToken}
          />

          <Card
            title="Current Citizen"
            value={currentCitizen}
          />

          <Card
            title="Waiting Visitors"
            value="3"
          />

          <Card
            title="Estimated Wait"
            value="30 mins"
          />
        </div>

        {/* Current Visitor */}

        <div style={card}>
          <h2>
            Currently Serving
          </h2>

          <div
            style={{
              marginTop: "20px"
            }}
          >
            <h3>
              {currentCitizen}
            </h3>

            <p>
              Token:
              {" "}
              {currentToken}
            </p>

            <p>
              Purpose:
              Scholarship Query
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              marginTop: "20px"
            }}
          >
            <button
              style={successBtn}
            >
              Mark Arrived
            </button>

            <button
              style={primaryBtn}
            >
              Start Meeting
            </button>

            <button
              style={dangerBtn}
            >
              No Show
            </button>

            <button
              style={completeBtn}
            >
              Complete Meeting
            </button>
          </div>
        </div>

        {/* Waiting Queue */}

        <div style={card}>
          <h2>
            Waiting Queue
          </h2>

          <table
            style={{
              width: "100%",
              marginTop: "20px"
            }}
          >
            <thead>
              <tr>
                <th style={th}>
                  Token
                </th>

                <th style={th}>
                  Name
                </th>

                <th style={th}>
                  Purpose
                </th>

                <th style={th}>
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {waitingQueue.map(
                (visitor) => (
                  <tr
                    key={
                      visitor.token
                    }
                  >
                    <td style={td}>
                      {visitor.token}
                    </td>

                    <td style={td}>
                      {visitor.name}
                    </td>

                    <td style={td}>
                      {visitor.purpose}
                    </td>

                    <td style={td}>
                      Waiting
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Card({
  title,
  value
}) {
  return (
    <div
      style={{
        background: "white",
        padding: "25px",
        borderRadius: "20px",
        boxShadow:
          "0 10px 30px rgba(0,0,0,0.08)"
      }}
    >
      <p
        style={{
          color: "#64748B"
        }}
      >
        {title}
      </p>

      <h1>
        {value}
      </h1>
    </div>
  );
}

const card = {
  background: "white",
  padding: "30px",
  borderRadius: "20px",
  marginTop: "25px",
  boxShadow:
    "0 10px 30px rgba(0,0,0,0.08)"
};

const th = {
  textAlign: "left",
  paddingBottom: "15px"
};

const td = {
  padding: "15px 0"
};

const primaryBtn = {
  background: "#2563EB",
  color: "white",
  border: "none",
  padding: "12px 18px",
  borderRadius: "12px",
  cursor: "pointer"
};

const successBtn = {
  background: "#22C55E",
  color: "white",
  border: "none",
  padding: "12px 18px",
  borderRadius: "12px",
  cursor: "pointer"
};

const dangerBtn = {
  background: "#EF4444",
  color: "white",
  border: "none",
  padding: "12px 18px",
  borderRadius: "12px",
  cursor: "pointer"
};

const completeBtn = {
  background: "#0F766E",
  color: "white",
  border: "none",
  padding: "12px 18px",
  borderRadius: "12px",
  cursor: "pointer"
};