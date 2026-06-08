import logo from "../assets/tribal-logo.jpg";

export default function Header({ language, setLanguage }) {
  return (
    <div
      style={{
        background: "#1e3a8a",
        color: "white",
        padding: "12px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: "0 0 16px 16px"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <img
          src={logo}
          alt="logo"
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%"
          }}
        />

        <div>
          <h3 style={{ margin: 0 }}>SHABRI</h3>
          <small>Smart Appointment Portal</small>
        </div>
      </div>

      <div style={{ display: "flex", gap: "8px" }}>
        <button onClick={() => setLanguage("en")}>EN</button>
        <button onClick={() => setLanguage("mr")}>मराठी</button>
        <button onClick={() => setLanguage("hi")}>हिंदी</button>
      </div>
    </div>
  );
}