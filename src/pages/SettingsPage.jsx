import { useRef, useState } from "react";
import {
  User, Bell, Lock, Phone, Sparkles, Check, AlertCircle, Camera, LogOut,
} from "lucide-react";
import { COLORS, GRADIENT_BRAND } from "../theme";
import { PageHero } from "../components/ui";
import { PasswordInput } from "../components/auth";
import LineIcon from "../components/LineIcon";
import ThemeToggle from "../components/ThemeToggle";
import { useAuth } from "../authStore";

const inputStyle = {
  width: "100%", padding: "12px 14px", borderRadius: 10, border: `1px solid ${COLORS.cardBorder}`,
  fontSize: "0.9rem", color: COLORS.text, fontFamily: "inherit", outline: "none", boxSizing: "border-box",
  background: COLORS.card,
};

function initials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function SettingsCard({ icon: Icon, title, desc, children }) {
  return (
    <div style={{
      background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 20,
      padding: "26px 24px", display: "flex", flexDirection: "column", gap: 18,
    }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div style={{ width: 38, height: 38, borderRadius: 10, background: COLORS.redSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={18} color={COLORS.red} />
        </div>
        <div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.02rem", color: COLORS.text }}>{title}</div>
          {desc && <div style={{ fontSize: "0.82rem", color: COLORS.textDim, marginTop: 3 }}>{desc}</div>}
        </div>
      </div>
      {children}
    </div>
  );
}

function InlineMessage({ tone = "success", children }) {
  const isError = tone === "error";
  return (
    <div style={{
      display: "flex", gap: 8, alignItems: "flex-start", borderRadius: 10, padding: "10px 12px", fontSize: "0.82rem",
      background: isError ? COLORS.redSoft : "rgba(22,163,74,0.1)",
      border: `1px solid ${isError ? COLORS.redSoft2 : "rgba(22,163,74,0.22)"}`,
      color: isError ? COLORS.redDark : COLORS.greenDark,
    }}>
      {isError ? <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} /> : <Check size={16} style={{ flexShrink: 0, marginTop: 1 }} />}
      {children}
    </div>
  );
}

// ---------------------------------------------
// Profile: display name + avatar upload
// ---------------------------------------------
function ProfileSection({ user, updateProfile }) {
  const [name, setName] = useState(user.name);
  const [msg, setMsg] = useState(null);
  const fileRef = useRef(null);

  const saveName = async () => {
    try {
      await updateProfile({ name });
      setMsg({ tone: "success", text: "บันทึกชื่อเรียบร้อยแล้ว" });
    } catch (err) {
      setMsg({ tone: "error", text: err.message || "บันทึกไม่สำเร็จ" });
    }
  };

  const handleAvatarPick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMsg({ tone: "error", text: "กรุณาเลือกไฟล์รูปภาพเท่านั้น" });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setMsg({ tone: "error", text: "ขนาดรูปภาพต้องไม่เกิน 2MB" });
      return;
    }
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        await updateProfile({ avatar: reader.result });
        setMsg({ tone: "success", text: "เปลี่ยนรูปโปรไฟล์เรียบร้อยแล้ว" });
      } catch (err) {
        setMsg({ tone: "error", text: err.message || "เปลี่ยนรูปโปรไฟล์ไม่สำเร็จ" });
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <SettingsCard icon={User} title="โปรไฟล์" desc="ชื่อที่แสดงและรูปโปรไฟล์ของคุณ">
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ position: "relative", flexShrink: 0 }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%", background: user.avatar ? `center/cover no-repeat url(${user.avatar})` : GRADIENT_BRAND,
            display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "1.1rem",
          }}>
            {!user.avatar && initials(name)}
          </div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            title="เปลี่ยนรูปโปรไฟล์"
            style={{
              position: "absolute", bottom: -2, right: -2, width: 26, height: 26, borderRadius: "50%",
              background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, display: "flex", alignItems: "center",
              justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 10px rgba(20,18,30,0.15)",
            }}
          >
            <Camera size={13} color={COLORS.text} />
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleAvatarPick} style={{ display: "none" }} />
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          <label style={{ fontSize: "0.78rem", fontWeight: 600, color: COLORS.textDim }}>ชื่อ-นามสกุล</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} />
            <button
              onClick={saveName}
              style={{ background: GRADIENT_BRAND, color: "#fff", border: "none", borderRadius: 10, padding: "0 18px", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", whiteSpace: "nowrap" }}
            >
              บันทึก
            </button>
          </div>
        </div>
      </div>
      {msg && <InlineMessage tone={msg.tone}>{msg.text}</InlineMessage>}
    </SettingsCard>
  );
}

// ---------------------------------------------
// Notifications toggle
// ---------------------------------------------
function NotificationsSection({ user, updateNotifications }) {
  const enabled = user.notifications !== false;
  return (
    <SettingsCard icon={Bell} title="การแจ้งเตือน" desc="รับการแจ้งเตือนทางอีเมลและในแอปเมื่อมีความเคลื่อนไหวสำคัญ">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: "0.88rem", color: COLORS.text, fontWeight: 600 }}>เปิดรับการแจ้งเตือน</div>
        <button
          onClick={() => { updateNotifications(!enabled).catch(() => {}); }}
          aria-pressed={enabled}
          style={{
            width: 48, height: 28, borderRadius: 999, border: "none", cursor: "pointer", position: "relative",
            background: enabled ? GRADIENT_BRAND : COLORS.cardAlt, transition: "background 200ms ease",
            boxShadow: enabled ? "none" : `inset 0 0 0 1px ${COLORS.cardBorder}`,
          }}
        >
          <span style={{
            position: "absolute", top: 3, left: enabled ? 23 : 3, width: 22, height: 22, borderRadius: "50%",
            background: "#fff", transition: "left 200ms ease", boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
          }} />
        </button>
      </div>
    </SettingsCard>
  );
}

// ---------------------------------------------
// Change password (only for email/password accounts)
// ---------------------------------------------
function PasswordSection({ user, changePassword }) {
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  if (user.provider !== "email") {
    return (
      <SettingsCard icon={Lock} title="เปลี่ยนรหัสผ่าน" desc="จัดการรหัสผ่านสำหรับเข้าสู่ระบบ">
        <div style={{ fontSize: "0.85rem", color: COLORS.textDim }}>
          บัญชีนี้เข้าสู่ระบบผ่าน {user.provider === "google" ? "Google" : "Line"} จึงไม่มีรหัสผ่านสำหรับ Obfice Base โดยตรง
        </div>
      </SettingsCard>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      await changePassword(form);
      setForm({ current: "", next: "", confirm: "" });
      setMsg({ tone: "success", text: "เปลี่ยนรหัสผ่านเรียบร้อยแล้ว" });
    } catch (err) {
      setMsg({ tone: "error", text: err.message || "เปลี่ยนรหัสผ่านไม่สำเร็จ" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SettingsCard icon={Lock} title="เปลี่ยนรหัสผ่าน" desc="ใช้รหัสผ่านที่คาดเดายาก และไม่ซ้ำกับบริการอื่น">
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {msg && <InlineMessage tone={msg.tone}>{msg.text}</InlineMessage>}
        <PasswordInput inputStyle={inputStyle} placeholder="รหัสผ่านปัจจุบัน" value={form.current} onChange={(e) => setForm({ ...form, current: e.target.value })} />
        <PasswordInput inputStyle={inputStyle} placeholder="รหัสผ่านใหม่ (อย่างน้อย 6 ตัวอักษร)" value={form.next} onChange={(e) => setForm({ ...form, next: e.target.value })} />
        <PasswordInput inputStyle={inputStyle} placeholder="ยืนยันรหัสผ่านใหม่" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
        <button type="submit" disabled={loading} style={{
          background: GRADIENT_BRAND, color: "#fff", border: "none", borderRadius: 10, padding: "11px 18px",
          fontWeight: 700, fontSize: "0.88rem", cursor: loading ? "default" : "pointer", opacity: loading ? 0.75 : 1, alignSelf: "flex-start",
        }}>
          {loading ? "กำลังบันทึก..." : "เปลี่ยนรหัสผ่าน"}
        </button>
      </form>
    </SettingsCard>
  );
}

// ---------------------------------------------
// Phone number
// ---------------------------------------------
function PhoneSection({ user, updatePhone }) {
  const [phone, setPhone] = useState(user.phone || "");
  const [msg, setMsg] = useState(null);

  const save = async () => {
    try {
      await updatePhone(phone);
      setMsg({ tone: "success", text: "บันทึกเบอร์โทรศัพท์เรียบร้อยแล้ว" });
    } catch (err) {
      setMsg({ tone: "error", text: err.message || "บันทึกไม่สำเร็จ" });
    }
  };

  return (
    <SettingsCard icon={Phone} title="เบอร์โทรศัพท์" desc="ใช้สำหรับติดต่อและยืนยันตัวตนกรณีจำเป็น">
      <div style={{ display: "flex", gap: 8 }}>
        <input style={inputStyle} placeholder="เช่น 081-234-5678" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <button
          onClick={save}
          style={{ background: GRADIENT_BRAND, color: "#fff", border: "none", borderRadius: 10, padding: "0 18px", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", whiteSpace: "nowrap" }}
        >
          บันทึก
        </button>
      </div>
      {msg && <InlineMessage tone={msg.tone}>{msg.text}</InlineMessage>}
    </SettingsCard>
  );
}

// ---------------------------------------------
// Connect / disconnect Line account
// ---------------------------------------------
function LineSection({ user, linkLine, unlinkLine }) {
  const [msg, setMsg] = useState(null);

  const connect = async () => {
    try {
      await linkLine();
      setMsg({ tone: "success", text: "เชื่อมต่อบัญชี Line เรียบร้อยแล้ว" });
    } catch (err) {
      setMsg({ tone: "error", text: err.message || "เชื่อมต่อไม่สำเร็จ" });
    }
  };

  const disconnect = async () => {
    try {
      await unlinkLine();
      setMsg({ tone: "success", text: "ยกเลิกการเชื่อมต่อบัญชี Line แล้ว" });
    } catch (err) {
      setMsg({ tone: "error", text: err.message || "ยกเลิกการเชื่อมต่อไม่สำเร็จ" });
    }
  };

  return (
    <SettingsCard icon={LineIcon} title="เชื่อมต่อบัญชี Line" desc="เข้าสู่ระบบด้วย Line หรือรับการแจ้งเตือนผ่าน Line ได้สะดวกขึ้น">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: COLORS.lineSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <LineIcon size={17} />
          </div>
          <div>
            <div style={{ fontSize: "0.88rem", fontWeight: 600, color: COLORS.text }}>
              {user.lineLinked ? "เชื่อมต่อแล้ว" : "ยังไม่ได้เชื่อมต่อ"}
            </div>
            <div style={{ fontSize: "0.76rem", color: COLORS.textDim }}>
              {user.provider === "line" ? "บัญชีนี้เข้าสู่ระบบด้วย Line" : "เชื่อมต่อเพื่อเข้าสู่ระบบด้วย Line ได้ในครั้งถัดไป"}
            </div>
          </div>
        </div>
        {user.lineLinked ? (
          user.provider === "line" ? (
            <span style={{ fontSize: "0.78rem", color: COLORS.textDim, fontWeight: 600 }}>บัญชีหลัก</span>
          ) : (
            <button onClick={disconnect} style={{ background: COLORS.card, color: COLORS.red, border: `1px solid ${COLORS.redSoft2}`, borderRadius: 999, padding: "9px 16px", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer" }}>
              ยกเลิกการเชื่อมต่อ
            </button>
          )
        ) : (
          <button onClick={connect} style={{ background: COLORS.line, color: "#fff", border: "none", borderRadius: 999, padding: "9px 16px", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            <LineIcon size={15} /> เชื่อมต่อ Line
          </button>
        )}
      </div>
      {msg && <InlineMessage tone={msg.tone}>{msg.text}</InlineMessage>}
    </SettingsCard>
  );
}

// ---------------------------------------------
// Demo code redemption — "luckydays" upgrades Free -> Pro
// ---------------------------------------------
function PlanSection({ user, redeemCode, setPage }) {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState(null);
  const isPro = user.plan === "pro";

  const submit = async (e) => {
    e.preventDefault();
    try {
      const result = await redeemCode(code);
      setCode("");
      setMsg({
        tone: "success",
        text: result === "already" ? "บัญชีของคุณเป็น Pro อยู่แล้ว" : "ใส่โค้ดสำเร็จ! อัปเกรดเป็น Pro เรียบร้อยแล้ว ปลดล็อกทุกฟีเจอร์ของแพ็กเกจ ฿990",
      });
    } catch (err) {
      setMsg({ tone: "error", text: err.message || "ใส่โค้ดไม่สำเร็จ" });
    }
  };

  return (
    <SettingsCard icon={Sparkles} title="แพ็กเกจและโค้ดส่วนลด" desc={`สถานะปัจจุบัน: ${isPro ? "Pro" : "Free"}`}>
      {isPro ? (
        <InlineMessage tone="success">บัญชีของคุณเป็นแพ็กเกจ Pro — ใช้งานได้ทุกฟีเจอร์เหมือนแพ็กเกจ ฿990/ผู้ใช้/เดือน</InlineMessage>
      ) : (
        <>
          <form onSubmit={submit} style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input
              style={{ ...inputStyle, flex: "1 1 180px" }}
              placeholder="กรอกโค้ดส่วนลด"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <button type="submit" style={{ background: GRADIENT_BRAND, color: "#fff", border: "none", borderRadius: 10, padding: "0 20px", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>
              ใช้โค้ด
            </button>
          </form>
          {msg && <InlineMessage tone={msg.tone}>{msg.text}</InlineMessage>}
          <div style={{ fontSize: "0.78rem", color: COLORS.textDim }}>
            ไม่มีโค้ด?{" "}
            <span onClick={() => setPage("pricing")} style={{ color: COLORS.red, fontWeight: 600, cursor: "pointer" }}>
              ดูแพ็กเกจ Pro
            </span>
          </div>
        </>
      )}
    </SettingsCard>
  );
}

function SettingsPage({ setPage }) {
  const {
    user, updateProfile, updatePhone, updateNotifications, changePassword,
    linkLine, unlinkLine, redeemCode, logout,
  } = useAuth();

  if (!user) {
    return (
      <div style={{ position: "relative" }}>
        <PageHero eyebrow="ตั้งค่า" title="กรุณาเข้าสู่ระบบ" gradientWord="ก่อนตั้งค่าบัญชี" desc="เข้าสู่ระบบเพื่อจัดการโปรไฟล์ การแจ้งเตือน และการเชื่อมต่อบัญชีของคุณ" />
        <div style={{ textAlign: "center", paddingBottom: 100 }}>
          <button
            onClick={() => setPage("login")}
            style={{ background: GRADIENT_BRAND, color: "#fff", border: "none", borderRadius: 999, padding: "13px 26px", fontSize: "0.92rem", fontWeight: 700, cursor: "pointer" }}
          >
            ไปหน้าเข้าสู่ระบบ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      <PageHero eyebrow="บัญชีของฉัน" title="ตั้งค่า" gradientWord="บัญชีของคุณ" desc="จัดการโปรไฟล์ ความปลอดภัย การแจ้งเตือน และการเชื่อมต่อบัญชีทั้งหมดได้จากที่เดียว" />
      <section style={{ position: "relative", zIndex: 2, maxWidth: 720, margin: "0 auto", padding: "10px 24px 100px", display: "flex", flexDirection: "column", gap: 18 }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 4px 8px" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 600, color: COLORS.textDim }}>ธีมการแสดงผล</div>
          <ThemeToggle />
        </div>

        <ProfileSection user={user} updateProfile={updateProfile} />
        <PlanSection user={user} redeemCode={redeemCode} setPage={setPage} />
        <NotificationsSection user={user} updateNotifications={updateNotifications} />
        <PasswordSection user={user} changePassword={changePassword} />
        <PhoneSection user={user} updatePhone={updatePhone} />
        <LineSection user={user} linkLine={linkLine} unlinkLine={unlinkLine} />

        <button
          onClick={() => { logout(); setPage("home"); }}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 4,
            background: "transparent", color: COLORS.red, border: `1px solid ${COLORS.redSoft2}`,
            borderRadius: 999, padding: "12px 20px", fontSize: "0.88rem", fontWeight: 700, cursor: "pointer",
          }}
        >
          <LogOut size={15} /> ออกจากระบบ
        </button>
      </section>
    </div>
  );
}

export default SettingsPage;
