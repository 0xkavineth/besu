import { useState } from "react";
import { Check, AlertCircle, Loader2 } from "lucide-react";
import { COLORS, GRADIENT_BRAND } from "../theme";
import { GhostButton } from "../components/ui";
import { AuthShell, GoogleAuthButton, LineAuthButton, AuthDivider, PasswordInput } from "../components/auth";
import { useAuth } from "../authStore";

const APP_LABELS = {
  accounting: "AccounTrack",
  lexcase: "LexCase",
  "app-lexcase": "LexCase",
  taxplan: "TaxPlan Pro",
  fininsight: "FinInsight",
};

function LoginPage({ setPage }) {
  const { login, loginWithGoogle, loginWithLine, pendingRedirect, consumeRedirect } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState(null); // null | "email" | "google" | "line"
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputStyle = {
    width: "100%", padding: "12px 14px", borderRadius: 10, border: `1px solid ${COLORS.cardBorder}`,
    fontSize: "0.9rem", color: COLORS.text, fontFamily: "inherit", outline: "none", boxSizing: "border-box",
  };

  const redirectLabel = pendingRedirect ? APP_LABELS[pendingRedirect] : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form);
      setStatus("email");
    } catch (err) {
      setError(err.message || "เข้าสู่ระบบไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    try {
      await loginWithGoogle();
      // On success the browser navigates away to Google, so there's
      // nothing further to do here.
    } catch (err) {
      setError(err.message || "เข้าสู่ระบบด้วย Google ไม่สำเร็จ");
    }
  };

  const handleLine = async () => {
    setError("");
    try {
      await loginWithLine();
      setStatus("line");
    } catch (err) {
      setError(err.message || "เข้าสู่ระบบด้วย Line ไม่สำเร็จ");
    }
  };

  const finishAndGo = () => {
    const target = consumeRedirect();
    setPage(target || "home");
  };

  if (status) {
    const statusLabel = status === "google" ? "เข้าสู่ระบบด้วย Google สำเร็จ" : status === "line" ? "เข้าสู่ระบบด้วย Line สำเร็จ" : "เข้าสู่ระบบสำเร็จ";
    return (
      <AuthShell>
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: COLORS.redSoft, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", animation: "logoPop 600ms cubic-bezier(0.34,1.56,0.64,1) both" }}>
            <Check size={24} color={COLORS.red} />
          </div>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>
            {statusLabel}
          </div>
          <div style={{ fontSize: "0.88rem", color: COLORS.textDim, marginBottom: 20 }}>
            {redirectLabel
              ? `ยินดีต้อนรับกลับ พร้อมเปิดใช้งาน ${redirectLabel} แล้ว`
              : "ยินดีต้อนรับกลับสู่ Obfice Base — บัญชีของคุณอยู่ในแพ็กเกจ Free"}
          </div>
          <GhostButton onClick={finishAndGo} style={{ width: "100%" }}>
            {redirectLabel ? `ไปที่หน้า ${redirectLabel}` : "กลับหน้าแรก"}
          </GhostButton>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.3rem", textAlign: "center", marginBottom: 4 }}>
        เข้าสู่ระบบ Obfice Base
      </div>
      <div style={{ fontSize: "0.85rem", color: COLORS.textDim, textAlign: "center", marginBottom: 22 }}>
        {redirectLabel ? `เข้าสู่ระบบเพื่อเปิดใช้งาน ${redirectLabel}` : "ยินดีต้อนรับกลับ เข้าสู่ระบบเพื่อใช้งานต่อ"}
      </div>

      <GoogleAuthButton label="เข้าสู่ระบบด้วย Google" onClick={handleGoogle} />
      <LineAuthButton label="เข้าสู่ระบบด้วย Line" onClick={handleLine} />
      <AuthDivider />

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {error && (
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start", background: COLORS.redSoft, border: `1px solid ${COLORS.redSoft2}`, borderRadius: 10, padding: "10px 12px", fontSize: "0.82rem", color: COLORS.redDark }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} /> {error}
          </div>
        )}
        <input style={inputStyle} type="email" placeholder="อีเมล" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <PasswordInput inputStyle={inputStyle} placeholder="รหัสผ่าน" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.8rem", color: COLORS.textDim }}>
          <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <input type="checkbox" /> จดจำฉัน
          </label>
          <span style={{ cursor: "pointer", color: COLORS.red, fontWeight: 600 }}>ลืมรหัสผ่าน?</span>
        </div>
        <button type="submit" disabled={loading} style={{
          background: GRADIENT_BRAND, color: "#fff", border: "none", borderRadius: 999,
          padding: "12px 20px", fontSize: "0.92rem", fontWeight: 700, cursor: loading ? "default" : "pointer", marginTop: 4,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: loading ? 0.75 : 1,
        }}>
          {loading && <Loader2 size={16} style={{ animation: "pulseSoft 900ms linear infinite" }} />}
          {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
        </button>
      </form>

      <div style={{ textAlign: "center", fontSize: "0.85rem", color: COLORS.textDim, marginTop: 20 }}>
        ยังไม่มีบัญชี?{" "}
        <span onClick={() => setPage("signup")} style={{ color: COLORS.red, fontWeight: 600, cursor: "pointer" }}>สมัครสมาชิก</span>
      </div>
    </AuthShell>
  );
}

export default LoginPage;
