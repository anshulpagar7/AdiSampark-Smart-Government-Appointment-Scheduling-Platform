import { useState } from "react";

import CitizenBooking from "./pages/CitizenBooking";

import StaffLogin from "./pages/staff/StaffLogin";
import StaffLayout from "./pages/staff/StaffLayout";

import MDLogin from "./pages/md/MDLogin";
import MDLayout from "./pages/md/MDLayout";

export default function App() {

  const [page, setPage] = useState("citizen");

  const [isStaffLoggedIn, setIsStaffLoggedIn] = useState(false);

  const [isMDLoggedIn, setIsMDLoggedIn] = useState(false);

  return (

    <div>

      {/* Top Navigation */}

      <div

        style={{

          display: "flex",

          gap: "12px",

          padding: "15px",

          background: "#ffffff",

          borderBottom: "1px solid #e5e7eb",

          position: "sticky",

          top: 0,

          zIndex: 1000,

        }}

      >

        {/* Citizen */}

        <button

          onClick={() => setPage("citizen")}

          style={{

            ...navButton,

            background:

              page === "citizen"

                ? "#2563EB"

                : "#F1F5F9",

            color:

              page === "citizen"

                ? "white"

                : "#0F172A",

          }}

        >

          Citizen Portal

        </button>

        {/* Staff Login */}

        <button

          onClick={() => setPage("staffLogin")}

          style={{

            ...navButton,

            background:

              page === "staffLogin"

                ? "#2563EB"

                : "#F1F5F9",

            color:

              page === "staffLogin"

                ? "white"

                : "#0F172A",

          }}

        >

          Staff Login

        </button>

        {/* MD Login */}

        <button

          onClick={() => setPage("mdLogin")}

          style={{

            ...navButton,

            background:

              page === "mdLogin"

                ? "#10B981"

                : "#F1F5F9",

            color:

              page === "mdLogin"

                ? "white"

                : "#0F172A",

          }}

        >

          MD Login

        </button>

      </div>

      {/* Citizen */}

      {page === "citizen" && (

        <CitizenBooking />

      )}

      {/* Staff Login */}

      {page === "staffLogin" && (

        <StaffLogin

          onLogin={() => {

            setIsStaffLoggedIn(true);

            setPage("staff");

          }}

        />

      )}

      {/* Staff Portal */}

      {page === "staff" &&

        isStaffLoggedIn && (

          <StaffLayout />

      )}

      {/* MD Login */}

      {page === "mdLogin" && (

        <MDLogin

          onLogin={() => {

            setIsMDLoggedIn(true);

            setPage("md");

          }}

        />

      )}

      {/* MD Dashboard */}

      {page === "md" &&

        isMDLoggedIn && (

          <MDLayout />

      )}

    </div>

  );

}

const navButton = {

  border: "none",

  padding: "12px 18px",

  borderRadius: "10px",

  cursor: "pointer",

  fontWeight: "600",

  transition: "0.3s",

};