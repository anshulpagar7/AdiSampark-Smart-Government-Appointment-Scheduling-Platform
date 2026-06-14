import { useState } from "react";

import MDDashboard from "./MDDashboard";

export default function MDLayout() {
  const [active, setActive] = useState("Dashboard");

  const renderPage = () => {
    switch (active) {
      case "Dashboard":
        return (
          <MDDashboard setActive={setActive} />
        );

      default:
        return (
          <MDDashboard setActive={setActive} />
        );
    }
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#F8FAFC",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "300px",
          background:
            "linear-gradient(180deg,#064E3B,#022C22)",
          color: "white",
          padding: "30px 20px",
          display: "flex",
          flexDirection: "column",
          boxShadow:
            "4px 0 20px rgba(0,0,0,0.08)",
        }}
      >
        {/* Logo Area */}
        <div>
          <h1
            style={{
              fontSize: "34px",
              fontWeight: "700",
              color: "#6EE7B7",
              marginBottom: "6px",
            }}
          >
            MD Portal
          </h1>

          <p
            style={{
              color: "#D1FAE5",
              fontSize: "14px",
              lineHeight: "1.6",
            }}
          >
            Managing Director Dashboard
          </p>
        </div>

        {/* Menu */}
        <div
          style={{
            marginTop: "50px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <button
            onClick={() => setActive("Dashboard")}
            style={{
              ...menuButton,
              background:
                active === "Dashboard"
                  ? "#10B981"
                  : "transparent",
            }}
          >
            📊 Dashboard
          </button>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: "auto",
            paddingTop: "30px",
            borderTop:
              "1px solid rgba(255,255,255,0.15)",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              color: "#A7F3D0",
              lineHeight: "1.6",
            }}
          >
            Maharashtra State
            <br />
            Cooperative Tribal
            <br />
            Development Corporation Ltd.
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
        }}
      >
        {renderPage()}
      </div>
    </div>
  );
}

const menuButton = {
  color: "white",
  border: "none",
  padding: "16px 18px",
  borderRadius: "14px",
  cursor: "pointer",
  textAlign: "left",
  fontSize: "15px",
  fontWeight: "600",
  transition: "0.3s",
};