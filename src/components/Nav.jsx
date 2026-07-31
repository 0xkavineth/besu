import { useState } from "react";
import { ChevronDown, Download as DownloadIcon, Menu, X, LogOut, Settings } from "lucide-react";
import { COLORS, GRADIENT_BRAND } from "../theme";
import { PRODUCTS_MENU, SOLUTIONS_MENU } from "../data";
import { useAuth } from "../authStore";
import Logo from "./Logo";
import { GhostButton } from "./ui";
import ThemeToggle from "./ThemeToggle";

function NavDropdown({ label, items, setPage }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <span style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: COLORS.textDim, fontWeight: 500 }}>
        {label} <ChevronDown size={14} style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 180ms ease" }} />
      </span>
      {open && (
        <div className="fade-up" style={{
          position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: 14,
          background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 16,
          boxShadow: "0 20px 40px -16px rgba(20,18,30,0.18)", padding: 10, width: 300, zIndex: 20,
        }}>
          {items.map((item) => (
            <div
              key={item.label}
              onClick={() => setPage(item.key)}
              style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 12px", borderRadius: 10, cursor: "pointer" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.cardAlt)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div style={{ width: 34, height: 34, borderRadius: 9, background: COLORS.redSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <item.icon size={16} color={COLORS.red} />
              </div>
              <div>
                <div style={{ fontSize: "0.85rem", fontWeight: 600, color: COLORS.text }}>{item.label}</div>
                <div style={{ fontSize: "0.76rem", color: COLORS.textDim, marginTop: 2 }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function initials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function PlanBadge({ plan }) {
  const isPro = plan === "pro";
  return (
    <span style={{
      fontSize: "0.66rem", fontWeight: 700, letterSpacing: "0.04em", color: COLORS.redDark,
      background: COLORS.redSoft, border: `1px solid ${COLORS.redSoft2}`, borderRadius: 999,
      padding: "2px 8px", textTransform: "uppercase", whiteSpace: "nowrap",
    }}>
      {isPro ? "Pro" : plan === "free" ? "Free" : plan}
    </span>
  );
}

function ProfileMenu({ user, logout, go }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: "relative" }} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <div style={{
        display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
        padding: "5px 10px 5px 5px", borderRadius: 999, border: `1px solid ${COLORS.cardBorder}`,
      }}>
        <div style={{
          width: 28, height: 28, borderRadius: "50%",
          background: user.avatar ? `center/cover no-repeat url(${user.avatar})` : GRADIENT_BRAND, color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700, flexShrink: 0,
        }}>
          {!user.avatar && initials(user.name)}
        </div>
        <span style={{ fontSize: "0.82rem", fontWeight: 700, color: COLORS.text, whiteSpace: "nowrap" }}>{user.name}</span>
        <PlanBadge plan={user.plan} />
        <ChevronDown size={13} style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 180ms ease", color: COLORS.textDim }} />
      </div>
      {open && (
        <div className="fade-up" style={{
          position: "absolute", top: "100%", right: 0, marginTop: 10,
          background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 14,
          boxShadow: "0 20px 40px -16px rgba(20,18,30,0.18)", padding: 10, width: 230, zIndex: 20,
        }}>
          <div style={{ padding: "8px 10px 12px", borderBottom: `1px solid ${COLORS.cardBorder}`, marginBottom: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: COLORS.text }}>{user.name}</div>
              <PlanBadge plan={user.plan} />
            </div>
            <div style={{ fontSize: "0.74rem", color: COLORS.textDim, marginTop: 3 }}>{user.email}</div>
          </div>
          <div
            onClick={() => go("settings")}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 10px", borderRadius: 8, fontSize: "0.84rem", color: COLORS.text, cursor: "pointer" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.cardAlt)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <Settings size={14} /> ตั้งค่าบัญชี
          </div>
          <div
            onClick={() => go("pricing")}
            style={{ padding: "9px 10px", borderRadius: 8, fontSize: "0.84rem", color: COLORS.text, cursor: "pointer" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.cardAlt)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            อัปเกรดแพ็กเกจ
          </div>
          <div
            onClick={() => { logout(); go("home"); }}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 10px", borderRadius: 8, fontSize: "0.84rem", color: COLORS.red, fontWeight: 600, cursor: "pointer" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.redSoft)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <LogOut size={14} /> ออกจากระบบ
          </div>
        </div>
      )}
    </div>
  );
}

function Nav({ page, setPage }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const go = (key) => { setPage(key); setMobileOpen(false); };

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 30, backdropFilter: "blur(14px)",
      background: COLORS.navBg, borderBottom: `1px solid ${COLORS.cardBorder}`,
    }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20 }}>
        <div onClick={() => go("home")} style={{ flexShrink: 0 }}>
          <Logo />
        </div>

        <div className="nav-links-desktop" style={{ display: "flex", gap: 26, fontSize: "0.88rem", flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
          <NavDropdown label="ผลิตภัณฑ์" items={PRODUCTS_MENU} setPage={setPage} />
          <NavDropdown label="โซลูชั่น" items={SOLUTIONS_MENU} setPage={setPage} />
          <span onClick={() => go("resources")} style={{ cursor: "pointer", color: page === "resources" ? COLORS.text : COLORS.textDim, fontWeight: page === "resources" ? 700 : 500 }}>
            แหล่งข้อมูล
          </span>
          <span onClick={() => go("pricing")} style={{ cursor: "pointer", color: page === "pricing" ? COLORS.text : COLORS.textDim, fontWeight: page === "pricing" ? 700 : 500 }}>
            ราคา
          </span>
        </div>

        <div className="nav-actions-desktop" style={{ display: "flex", gap: 10, flexShrink: 0, alignItems: "center" }}>
          <ThemeToggle />
          <GhostButton onClick={() => go("download")} style={{ padding: "9px 16px", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 6 }}>
            <DownloadIcon size={15} /> ดาวน์โหลด
          </GhostButton>
          {user ? (
            <ProfileMenu user={user} logout={logout} go={go} />
          ) : (
            <>
              <span onClick={() => go("login")} style={{ cursor: "pointer", fontSize: "0.85rem", fontWeight: 600, color: COLORS.textDim }}>
                เข้าสู่ระบบ
              </span>
              <button onClick={() => go("signup")} style={{ background: GRADIENT_BRAND, color: "#fff", border: "none", borderRadius: 999, padding: "9px 20px", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>
                สมัครสมาชิก
              </button>
            </>
          )}
        </div>

        <button
          className="nav-mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ background: "none", border: `1px solid ${COLORS.cardBorder}`, borderRadius: 10, padding: 8, cursor: "pointer", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
        >
          {mobileOpen ? <X size={20} color={COLORS.text} /> : <Menu size={20} color={COLORS.text} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="fade-up" style={{
          borderTop: `1px solid ${COLORS.cardBorder}`, background: COLORS.card, maxHeight: "80vh", overflowY: "auto",
          padding: "18px 20px 26px", display: "flex", flexDirection: "column", gap: 22,
        }}>
          <MobileNavGroup title="ผลิตภัณฑ์" items={PRODUCTS_MENU} onSelect={go} />
          <MobileNavGroup title="โซลูชั่น" items={SOLUTIONS_MENU} onSelect={go} />

          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: COLORS.textDim, letterSpacing: "0.04em", marginBottom: 6 }}>เมนูอื่นๆ</div>
            {[["resources", "แหล่งข้อมูล"], ["pricing", "ราคา"], ["download", "ดาวน์โหลดโปรแกรม"]].map(([key, label]) => (
              <div key={key} onClick={() => go(key)} style={{ padding: "12px 4px", fontSize: "0.95rem", fontWeight: 600, color: COLORS.text, cursor: "pointer", borderBottom: `1px solid ${COLORS.cardBorder}` }}>
                {label}
              </div>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 4px" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: COLORS.text }}>ธีมการแสดงผล</span>
            <ThemeToggle />
          </div>

          {user ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 4px", borderTop: `1px solid ${COLORS.cardBorder}`, borderBottom: `1px solid ${COLORS.cardBorder}` }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: user.avatar ? `center/cover no-repeat url(${user.avatar})` : GRADIENT_BRAND, color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem", fontWeight: 700, flexShrink: 0,
                }}>
                  {!user.avatar && initials(user.name)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: "0.9rem", fontWeight: 700, color: COLORS.text }}>{user.name}</span>
                    <PlanBadge plan={user.plan} />
                  </div>
                  <div style={{ fontSize: "0.76rem", color: COLORS.textDim, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</div>
                </div>
              </div>
              <GhostButton onClick={() => go("settings")} style={{ width: "100%", justifyContent: "center", display: "flex", alignItems: "center", gap: 8 }}>
                <Settings size={15} /> ตั้งค่าบัญชี
              </GhostButton>
              <GhostButton onClick={() => { logout(); go("home"); }} style={{ width: "100%", justifyContent: "center", display: "flex", alignItems: "center", gap: 8 }}>
                <LogOut size={15} /> ออกจากระบบ
              </GhostButton>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <GhostButton onClick={() => go("login")} style={{ width: "100%", justifyContent: "center" }}>เข้าสู่ระบบ</GhostButton>
              <button onClick={() => go("signup")} style={{ background: GRADIENT_BRAND, color: "#fff", border: "none", borderRadius: 999, padding: "12px 20px", fontSize: "0.92rem", fontWeight: 700, cursor: "pointer", width: "100%" }}>
                สมัครสมาชิก
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

function MobileNavGroup({ title, items, onSelect }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ fontSize: "0.75rem", fontWeight: 700, color: COLORS.textDim, letterSpacing: "0.04em", marginBottom: 6 }}>{title}</div>
      {items.map((item) => (
        <div
          key={item.label}
          onClick={() => onSelect(item.key)}
          style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 4px", borderBottom: `1px solid ${COLORS.cardBorder}`, cursor: "pointer" }}
        >
          <div style={{ width: 32, height: 32, borderRadius: 9, background: COLORS.redSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <item.icon size={15} color={COLORS.red} />
          </div>
          <div style={{ fontSize: "0.92rem", fontWeight: 600, color: COLORS.text }}>{item.label}</div>
        </div>
      ))}
    </div>
  );
}
export default Nav;
