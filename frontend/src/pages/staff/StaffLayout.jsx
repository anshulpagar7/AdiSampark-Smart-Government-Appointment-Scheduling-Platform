import { useState } from "react";

import Sidebar from "../../components/Sidebar";

import StaffDashboard from "./StaffDashboard";
import Appointments from "./Appointments";
import ScheduleAppointment from "./ScheduleAppointment";
import HolidayManagement from "./HolidayManagement";
import Events from "./Events";
import Reports from "./Reports";

export default function StaffLayout() {
  const [active, setActive] =
    useState("Dashboard");

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#F8FAFC",
      }}
    >
      <Sidebar
        active={active}
        setActive={setActive}
      />

      <div
        style={{
          flex: 1,
          overflowY: "auto",
        }}
      >
        {active === "Dashboard" && (
          <StaffDashboard />
        )}

        {active === "Appointments" && (
          <Appointments />
        )}

        {active === "Schedule" && (
          <ScheduleAppointment />
        )}

        {active === "Holidays" && (
          <HolidayManagement />
        )}

        {active === "Events" && (
          <Events />
        )}

        {active === "Reports" && (
          <Reports />
        )}

        {active === "Settings" && (
          <div
            style={{
              padding: "40px",
            }}
          >
            <h1>Settings</h1>

            <div
              style={{
                background: "white",
                padding: "25px",
                borderRadius: "20px",
                marginTop: "20px",
                boxShadow:
                  "0 10px 30px rgba(0,0,0,0.08)",
              }}
            >
              <h2>
                System Settings
              </h2>

              <p>
                Working Hours:
                09:00 AM - 05:00 PM
              </p>

              <p>
                Lunch Break:
                01:00 PM - 02:00 PM
              </p>

              <p>
                WhatsApp Notifications:
                Enabled
              </p>

              <p>
                SMS Notifications:
                Enabled
              </p>

              <button
                style={{
                  marginTop: "20px",
                  background:
                    "#2563EB",
                  color: "white",
                  border: "none",
                  padding:
                    "12px 20px",
                  borderRadius:
                    "12px",
                  cursor:
                    "pointer",
                }}
              >
                Save Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}