import { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import CitizenBooking from "./pages/CitizenBooking";

import StaffLogin from "./pages/staff/StaffLogin";
import StaffLayout from "./pages/staff/StaffLayout";

import MDLogin from "./pages/md/MDLogin";
import MDLayout from "./pages/md/MDLayout";

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
      <Route path="/" element={<CitizenBooking />} />

      {/* Staff Login */}
      <Route
        path="/staff/login"
        element={
          <StaffLogin
            onLogin={() => {
              sessionStorage.setItem("staffLoggedIn", "true");
              setIsStaffLoggedIn(true);
              navigate("/staff");
            }}
          />
        }
      />

      {/* Staff Portal — protected */}
      <Route
        path="/staff"
        element={
          <ProtectedStaff isLoggedIn={isStaffLoggedIn}>
            <StaffLayout />
          </ProtectedStaff>
        }
      />

      {/* MD Login */}
      <Route
        path="/md/login"
        element={
          <MDLogin
            onLogin={() => {
              sessionStorage.setItem("mdLoggedIn", "true");
              setIsMDLoggedIn(true);
              navigate("/md");
            }}
          />
        }
      />

      {/* MD Dashboard — protected */}
      <Route
        path="/md"
        element={
          <ProtectedMD isLoggedIn={isMDLoggedIn}>
            <MDLayout />
          </ProtectedMD>
        }
      />

      {/* Catch-all — redirect unknown routes to citizen portal */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}