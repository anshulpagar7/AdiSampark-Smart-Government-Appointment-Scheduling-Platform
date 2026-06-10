import { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Dashboard from "./Dashboard";
import Appointments from "./Appointments";

export default function StaffLayout() {
  const [active, setActive] =
    useState("Dashboard");

  return (
    <div
      style={{
        display: "flex",
        background: "#0F172A",
        minHeight: "100vh"
      }}
    >
      <Sidebar
        active={active}
        setActive={setActive}
      />

      <div
        style={{
          flex: 1
        }}
      >
        {active === "Dashboard" && (
          <Dashboard />
        )}

        {active === "Appointments" && (
          <Appointments />
        )}

        {active === "Schedule" && (
          <div style={placeholder}>
            Schedule Appointment
          </div>
        )}

        {active === "Holidays" && (
          <div style={placeholder}>
            Holiday Management
          </div>
        )}

        {active === "Events" && (
          <div style={placeholder}>
            Events Management
          </div>
        )}

        {active === "Reports" && (
          <div style={placeholder}>
            Reports
          </div>
        )}

        {active === "Settings" && (
          <div style={placeholder}>
            Settings
          </div>
        )}
      </div>
    </div>
  );
}

const placeholder = {
  color: "white",
  padding: "40px",
  fontSize: "24px"
};