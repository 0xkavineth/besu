import { useState } from "react";
import { ArrowRight, Check, Mail, Phone, MapPin } from "lucide-react";
import { COLORS, GRADIENT_BRAND } from "../theme";
import { DotGridPattern } from "../components/Patterns";
import { PageHero } from "../components/ui";

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", topic: "", message: "" });
  const [sent, setSent] = useState(false);

  const inputStyle = {
    width: "100%", padding: "12px 14px", borderRadius: 10, border: `1px solid ${COLORS.cardBorder}`,
    fontSize: "0.9rem", color: COLORS.text, fontFamily: "inherit", outline: "none", boxSizing: "border-box",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div style={{ position: "relative" }}>
      <DotGridPattern style={{ top: 60, left: 0, color: COLORS.red, opacity: 0.14 }} />
      <PageHero eyebrow="ติดต่อเรา" title="ทีมงานพร้อม" gradientWord="ตอบทุกคำถาม" desc="ไม่ว่าจะสอบถามแพ็กเกจ ขอเดโม หรือแจ้งปัญหาการใช้งาน ทีมงานของเราตอบกลับภายใน 1 วันทำการ" />
      <section style={{ position: "relative", zIndex: 2, maxWidth: 1000, margin: "0 auto", padding: "20px 24px 100px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 28 }}>
        <form onSubmit={handleSubmit} style={{ background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 20, padding: "28px", display: "flex", flexDirection: "column", gap: 14 }}>
          {sent ? (
            <div style={{ textAlign: "center", padding: "40px 10px" }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: COLORS.redSoft, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", animation: "logoPop 600ms cubic-bezier(0.34,1.56,0.64,1) both" }}>
                <Check size={24} color={COLORS.red} />
              </div>
              <div style={{ fontWeight: 700, marginBottom: 6 }}>ส่งข้อความเรียบร้อยแล้ว</div>
              <div style={{ fontSize: "0.88rem", color: COLORS.textDim }}>ทีมงานจะติดต่อกลับภายใน 1 วันทำการ</div>
            </div>
          ) : (
            <>
              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 600, marginBottom: 6, display: "block" }}>ชื่อ-นามสกุล</label>
                <input style={inputStyle} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="เช่น สมชาย ใจดี" />
              </div>
              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 600, marginBottom: 6, display: "block" }}>อีเมล</label>
                <input style={inputStyle} type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@office.com" />
              </div>
              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 600, marginBottom: 6, display: "block" }}>หัวข้อ</label>
                <select style={inputStyle} value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}>
                  <option value="">เลือกหัวข้อ</option>
                  <option value="demo">ขอเดโมสินค้า</option>
                  <option value="pricing">สอบถามแพ็กเกจ</option>
                  <option value="support">แจ้งปัญหาการใช้งาน</option>
                  <option value="other">อื่นๆ</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: "0.82rem", fontWeight: 600, marginBottom: 6, display: "block" }}>ข้อความ</label>
                <textarea style={{ ...inputStyle, minHeight: 100, resize: "vertical" }} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="รายละเอียดที่ต้องการสอบถาม" />
              </div>
              <button type="submit" style={{
                background: GRADIENT_BRAND, color: "#fff", border: "none", borderRadius: 999,
                padding: "13px 26px", fontSize: "0.95rem", fontWeight: 700, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8, justifyContent: "center",
                width: "100%", marginTop: 6, boxShadow: "0 10px 24px -8px rgba(255,4,33,0.4)",
              }}>
                ส่งข้อความ <ArrowRight size={16} />
              </button>
            </>
          )}
        </form>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[
            { icon: Mail, label: "อีเมล", value: "hello@deskvault.example" },
            { icon: Phone, label: "โทรศัพท์", value: "02-123-4567 (จ.-ศ. 9:00-18:00)" },
            { icon: MapPin, label: "ที่อยู่สำนักงาน", value: "ชั้น 12 อาคารตัวอย่าง ถนนสุขุมวิท กรุงเทพฯ" },
          ].map((c) => (
            <div key={c.label} style={{ display: "flex", gap: 14, alignItems: "flex-start", background: COLORS.redSoft, border: `1px solid ${COLORS.redSoft2}`, borderRadius: 16, padding: "18px" }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: COLORS.card, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <c.icon size={18} color={COLORS.red} />
              </div>
              <div>
                <div style={{ fontSize: "0.78rem", fontWeight: 700, color: COLORS.red }}>{c.label}</div>
                <div style={{ fontSize: "0.9rem", color: COLORS.text, marginTop: 3 }}>{c.value}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------
// AUTH PAGES — Signup / Login (with Google sign-in)
// ---------------------------------------------
export default ContactPage;
