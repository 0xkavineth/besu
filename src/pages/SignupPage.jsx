import { useState } from "react";
import { Check, AlertCircle, Loader2 } from "lucide-react";
import { COLORS, GRADIENT_BRAND } from "../theme";
import { GhostButton } from "../components/ui";
import { AuthShell, GoogleAuthButton, LineAuthButton, AuthDivider, PasswordInput } from "../components/auth";
import { useAuth } from "../authStore";

const APP_LABELS = {
  accounting: "AccounTrack",
  lexcase: "LexCase",
  taxplan: "TaxPlan Pro",
  fininsight: "FinInsight",
};

function SignupPage({ setPage }) {
  const { signup, loginWithGoogle, loginWithLine, pendingRedirect, consumeRedirect } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [agreed, setAgreed] = useState(false);
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
    if (!agreed) {
      setError("กรุณายอมรับข้อกำหนดการใช้งานและนโยบายความเป็นส่วนตัวก่อน");
      return;
    }
    setLoading(true);
    try {
      await signup(form);
      setStatus("email");
    } catch (err) {
      setError(err.message || "สมัครสมาชิกไม่สำเร็จ");
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
      setError(err.message || "สมัครด้วย Google ไม่สำเร็จ");
    }
  };

  const handleLine = async () => {
    setError("");
    try {
      await loginWithLine();
      setStatus("line");
    } catch (err) {
      setError(err.message || "สมัครด้วย Line ไม่สำเร็จ");
    }
  };

  const finishAndGo = () => {
    const target = consumeRedirect();
    setPage(target || "home");
  };

  if (status) {
    const statusLabel = status === "google" ? "เชื่อมต่อกับ Google สำเร็จ" : status === "line" ? "เชื่อมต่อกับ Line สำเร็จ" : "สร้างบัญชีสำเร็จ";
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
            ยินดีต้อนรับสู่ Obfice Base — บัญชีของคุณเริ่มต้นด้วยแพ็กเกจ <strong>Free</strong>
            {redirectLabel ? ` พร้อมเปิดใช้งาน ${redirectLabel} แล้ว` : ""}
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
        สร้างบัญชี Obfice Base
      </div>
      <div style={{ fontSize: "0.85rem", color: COLORS.textDim, textAlign: "center", marginBottom: 22 }}>
        {redirectLabel ? `สมัครสมาชิกเพื่อเปิดใช้งาน ${redirectLabel}` : "เริ่มใช้งานฟรี ไม่ต้องใช้บัตรเครดิต"}
      </div>

      <GoogleAuthButton label="สมัครด้วย Google" onClick={handleGoogle} />
      <LineAuthButton label="สมัครด้วย Line" onClick={handleLine} />
      <AuthDivider />

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {error && (
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start", background: COLORS.redSoft, border: `1px solid ${COLORS.redSoft2}`, borderRadius: 10, padding: "10px 12px", fontSize: "0.82rem", color: COLORS.redDark }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} /> {error}
          </div>
        )}
        <input style={inputStyle} placeholder="ชื่อ-นามสกุล" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input style={inputStyle} type="email" placeholder="อีเมล" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <PasswordInput inputStyle={inputStyle} placeholder="รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <PasswordInput inputStyle={inputStyle} placeholder="ยืนยันรหัสผ่าน" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: "0.8rem", color: COLORS.textDim }}>
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} style={{ marginTop: 3 }} />
          <span>ฉันยอมรับข้อกำหนดการใช้งานและนโยบายความเป็นส่วนตัวของ Obfice Base</span>
        </div>
        <button type="submit" disabled={loading} style={{
          background: GRADIENT_BRAND, color: "#fff", border: "none", borderRadius: 999,
          padding: "12px 20px", fontSize: "0.92rem", fontWeight: 700, cursor: loading ? "default" : "pointer", marginTop: 4,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: loading ? 0.75 : 1,
        }}>
          {loading && <Loader2 size={16} style={{ animation: "pulseSoft 900ms linear infinite" }} />}
          {loading ? "กำลังสร้างบัญชี..." : "สร้างบัญชี"}
        </button>
      </form>

      <div style={{ textAlign: "center", fontSize: "0.85rem", color: COLORS.textDim, marginTop: 20 }}>
        มีบัญชีอยู่แล้ว?{" "}
        <span onClick={() => setPage("login")} style={{ color: COLORS.red, fontWeight: 600, cursor: "pointer" }}>เข้าสู่ระบบ</span>
      </div>
    </AuthShell>
  );
}
export default SignupPage;
