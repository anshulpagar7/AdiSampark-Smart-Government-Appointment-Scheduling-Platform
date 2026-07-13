import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import CitizenBooking from "./pages/CitizenBooking";

import StaffLogin from "./pages/staff/StaffLogin";
import StaffLayout from "./pages/staff/StaffLayout";

import MDLogin from "./pages/md/MDLogin";
import MDLayout from "./pages/md/MDLayout";

// ─── Per-route document title ─────────────────────────────────────────────────
// Sets the browser tab title when a route mounts. Wrap it around a route element
// so navigating between portals updates the tab (SPA — the tab won't change on
// its own otherwise).

function Title({ text, children }) {
  useEffect(() => {
    document.title = text;
  }, [text]);
  return children;
}

// ─── Protected Route Wrappers ─────────────────────────────────────────────────

function ProtectedStaff({ isLoggedIn, children }) {
  return isLoggedIn ? children : <Navigate to="/staff/login" replace />;
}

function ProtectedMD({ isLoggedIn, children }) {
  return isLoggedIn ? children : <Navigate to="/md/login" replace />;
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  // Persistent auth — survives browser refresh
  const [isStaffLoggedIn, setIsStaffLoggedIn] = useState(
    sessionStorage.getItem("staffLoggedIn") === "true"
  );

  const [isMDLoggedIn, setIsMDLoggedIn] = useState(
    sessionStorage.getItem("mdLoggedIn") === "true"
  );

  const navigate = useNavigate();

  return (
    <Routes>
      {/* Citizen Portal */}
      <Route path="/" element={<Title text="Adi Sampark Portal"><CitizenBooking /></Title>} />

      {/* Staff Login */}
      <Route
        path="/staff/login"
        element={
          <Title text="Staff Login — Adi Sampark">
            <StaffLogin
              onLogin={() => {
                sessionStorage.setItem("staffLoggedIn", "true");
                setIsStaffLoggedIn(true);
                navigate("/staff");
              }}
            />
          </Title>
        }
      />

      {/* Staff Portal — protected */}
      <Route
        path="/staff"
        element={
          <Title text="Staff Portal — Adi Sampark">
            <ProtectedStaff isLoggedIn={isStaffLoggedIn}>
              <StaffLayout />
            </ProtectedStaff>
          </Title>
        }
      />

      {/* MD Login */}
      <Route
        path="/md/login"
        element={
          <Title text="MD Login — Adi Sampark">
            <MDLogin
              onLogin={() => {
                sessionStorage.setItem("mdLoggedIn", "true");
                setIsMDLoggedIn(true);
                navigate("/md");
              }}
            />
          </Title>
        }
      />

      {/* MD Dashboard — protected */}
      <Route
        path="/md"
        element={
          <Title text="MD Portal — Adi Sampark">
            <ProtectedMD isLoggedIn={isMDLoggedIn}>
              <MDLayout />
            </ProtectedMD>
          </Title>
        }
      />

      {/* Catch-all — redirect unknown routes to citizen portal */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}