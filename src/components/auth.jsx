import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { COLORS } from "../theme";
import { DotGridPattern, PlusPattern } from "./Patterns";
import GoogleIcon from "./GoogleIcon";
import LineIcon from "./LineIcon";

function AuthShell({ children }) {
  return (
    <div style={{ position: "relative", minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "70px 24px" }}>
      <DotGridPattern style={{ top: 40, left: 0, color: COLORS.red, opacity: 0.12 }} />
      <PlusPattern style={{ bottom: 20, right: 0, color: COLORS.red, opacity: 0.1 }} />
      <div className="fade-up" style={{
        position: "relative", zIndex: 2, width: "100%", maxWidth: 420, background: COLORS.card,
        border: `1px solid ${COLORS.cardBorder}`, borderRadius: 22, padding: "34px 30px",
        boxShadow: "0 20px 50px -20px rgba(20,18,30,0.15)",
      }}>
        {children}
      </div>
    </div>
  );
}

function GoogleAuthButton({ label, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
      background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 999,
      padding: "11px 20px", fontSize: "0.9rem", fontWeight: 600, color: COLORS.text, cursor: "pointer",
    }}>
      <GoogleIcon size={18} /> {label}
    </button>
  );
}

function LineAuthButton({ label, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
      background: COLORS.line, border: `1px solid ${COLORS.line}`, borderRadius: 999,
      padding: "11px 20px", fontSize: "0.9rem", fontWeight: 600, color: "#fff", cursor: "pointer", marginTop: 10,
    }}>
      <LineIcon size={18} /> {label}
    </button>
  );
}

function AuthDivider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "18px 0" }}>
      <div style={{ flex: 1, height: 1, background: COLORS.cardBorder }} />
      <span style={{ fontSize: "0.78rem", color: COLORS.textDim }}>หรือ</span>
      <div style={{ flex: 1, height: 1, background: COLORS.cardBorder }} />
    </div>
  );
}

function PasswordInput({ value, onChange, placeholder, inputStyle }) {
  const [visible, setVisible] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ ...inputStyle, paddingRight: 40 }}
      />
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: COLORS.textDim, display: "flex" }}
      >
        {visible ? <EyeOff size={17} /> : <Eye size={17} />}
      </button>
    </div>
  );
}
export { AuthShell, GoogleAuthButton, LineAuthButton, AuthDivider, PasswordInput };
