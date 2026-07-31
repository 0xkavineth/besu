import { useState } from "react";
import { ExternalLink, X } from "lucide-react";
import { COLORS, GRADIENT_BRAND } from "../theme";
import { useInView, useCountUp } from "../hooks";
import { useAuth } from "../authStore";

function StatBlock({ label, value, suffix = "" }) {
  const [ref, inView] = useInView();
  const count = useCountUp(value, 1600, inView);
  return (
    <div ref={ref} style={{ textAlign: "left" }}>
      <div style={{
        fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.2rem, 5vw, 3.4rem)",
        fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1, color: COLORS.text,
      }}>
        {count.toLocaleString()}{suffix}
      </div>
      <div style={{ marginTop: 8, fontSize: "0.85rem", color: COLORS.textDim, letterSpacing: "0.02em" }}>{label}</div>
    </div>
  );
}

function FeatureCard({ icon: Icon, eyebrow, title, desc, delay = 0, color = COLORS.red, soft = COLORS.redSoft, soft2 = COLORS.redSoft2, onClick }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      onClick={onClick}
      style={{
        background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 20,
        padding: "30px 26px", display: "flex", flexDirection: "column", gap: 14,
        boxShadow: "0 1px 2px rgba(20,18,30,0.04)",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(18px)",
        transition: `opacity 600ms ease ${delay}ms, transform 600ms ease ${delay}ms, border-color 220ms ease, box-shadow 220ms ease`,
        cursor: onClick ? "pointer" : "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = color;
        e.currentTarget.style.boxShadow = `0 16px 32px -12px ${soft2}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = COLORS.cardBorder;
        e.currentTarget.style.boxShadow = "0 1px 2px rgba(20,18,30,0.04)";
      }}
    >
      <div style={{ width: 44, height: 44, borderRadius: 12, background: soft, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={21} color={color} strokeWidth={2.1} />
      </div>
      <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em", color }}>{eyebrow}</div>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.15rem", fontWeight: 600, color: COLORS.text }}>{title}</div>
      <div style={{ fontSize: "0.9rem", color: COLORS.textDim, lineHeight: 1.7 }}>{desc}</div>
    </div>
  );
}

function RoleChip({ label }) {
  return (
    <div style={{ border: `1px solid ${COLORS.redSoft2}`, borderRadius: 999, padding: "8px 16px", fontSize: "0.85rem", fontWeight: 600, color: COLORS.redDark, background: COLORS.redSoft, whiteSpace: "nowrap" }}>
      {label}
    </div>
  );
}

function SectionEyebrow({ children, style, soft = COLORS.redSoft, soft2 = COLORS.redSoft2, colorDark = COLORS.redDark }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 8, background: soft,
      border: `1px solid ${soft2}`, borderRadius: 999, padding: "6px 14px",
      fontSize: "0.78rem", fontWeight: 600, color: colorDark, marginBottom: 20, ...style,
    }}>
      {children}
    </div>
  );
}

// Monospace bracket-style label — a technical, understated section marker

function BracketLabel({ children, color = COLORS.red, style }) {
  return (
    <div style={{
      fontFamily: "'Space Mono', 'Courier New', monospace", fontSize: "0.75rem", fontWeight: 700,
      letterSpacing: "0.14em", color, marginBottom: 14, textTransform: "uppercase", ...style,
    }}>
      [ {children} ]
    </div>
  );
}

function PrimaryButton({ children, style, onClick, gradient = GRADIENT_BRAND, shadow = "255,4,33" }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: gradient, color: "#fff", border: "none", borderRadius: 999,
        padding: "13px 26px", fontSize: "0.95rem", fontWeight: 700, cursor: "pointer",
        display: "flex", alignItems: "center", gap: 8,
        boxShadow: hover ? `0 14px 28px -8px rgba(${shadow},0.5)` : `0 10px 22px -10px rgba(${shadow},0.4)`,
        transform: hover ? "translateY(-2px)" : "translateY(0)",
        transition: "all 200ms ease",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function GhostButton({ children, onClick, style }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: COLORS.card, color: COLORS.text, border: `1px solid ${hover ? COLORS.red : COLORS.cardBorder}`,
        borderRadius: 999, padding: "13px 26px", fontSize: "0.95rem", fontWeight: 600, cursor: "pointer",
        transform: hover ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hover ? "0 10px 20px -12px rgba(20,18,30,0.25)" : "none",
        transition: "all 200ms ease",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function AppLaunchModal({ open, onClose, appName, gradient, soft }) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(10,10,15,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ background: COLORS.card, borderRadius: 20, width: "100%", maxWidth: 640, maxHeight: "85vh", overflow: "hidden", boxShadow: "0 30px 60px -20px rgba(0,0,0,0.35)" }}>
        <div style={{ background: gradient, padding: "16px 22px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ color: "#fff", fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>{appName}</div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: 8, padding: 6, cursor: "pointer", display: "flex" }}>
            <X size={16} />
          </button>
        </div>
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ fontSize: "0.82rem", color: COLORS.textDim }}>ตัวอย่างหน้าจอแอป (Demo Preview)</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12 }}>
            {[1, 2, 3].map((i) => <div key={i} style={{ background: soft, borderRadius: 12, height: 70 }} />)}
          </div>
          <div style={{ background: COLORS.cardAlt, borderRadius: 12, height: 160, border: `1px solid ${COLORS.cardBorder}` }} />
          <div style={{ fontSize: "0.82rem", color: COLORS.textDim, textAlign: "center", marginTop: 6 }}>เข้าสู่ระบบเพื่อเริ่มใช้งาน {appName} เต็มรูปแบบ</div>
        </div>
      </div>
    </div>
  );
}

function OpenAppButton({ appName, appKey, setPage, gradient, soft, shadow, appRoute }) {
  const [open, setOpen] = useState(false);
  const { user, requestLogin } = useAuth();

  const handleClick = () => {
    if (user) {
      // If a real, fully-built app page exists for this product, go
      // straight there instead of showing the placeholder demo modal.
      if (appRoute && setPage) setPage(appRoute);
      else setOpen(true);
    } else {
      // Not logged in: remember which app they wanted, send them to login first.
      requestLogin(appKey);
      if (setPage) setPage("login");
    }
  };

  return (
    <>
      <PrimaryButton gradient={gradient} shadow={shadow} onClick={handleClick}>
        เปิดแอป <ExternalLink size={16} />
      </PrimaryButton>
      {!appRoute && <AppLaunchModal open={open} onClose={() => setOpen(false)} appName={appName} gradient={gradient} soft={soft} />}
    </>
  );
}

function PageHero({ eyebrow, title, gradientWord, desc, gradient = GRADIENT_BRAND, soft = COLORS.redSoft, soft2 = COLORS.redSoft2, colorDark = COLORS.redDark }) {
  return (
    <header style={{ position: "relative", zIndex: 2, maxWidth: 820, margin: "0 auto", textAlign: "center", padding: "90px 24px 30px" }}>
      <SectionEyebrow soft={soft} soft2={soft2} colorDark={colorDark}>{eyebrow}</SectionEyebrow>
      <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.1rem, 4.6vw, 3.4rem)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.2, margin: 0 }}>
        {title}{gradientWord && (
          <span style={{ background: gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}> {gradientWord}</span>
        )}
      </h1>
      {desc && <p style={{ marginTop: 18, fontSize: "1.02rem", color: COLORS.textDim, maxWidth: 580, margin: "18px auto 0", lineHeight: 1.7 }}>{desc}</p>}
    </header>
  );
}


export {
  StatBlock, FeatureCard, RoleChip, SectionEyebrow, BracketLabel,
  PrimaryButton, GhostButton, AppLaunchModal, OpenAppButton, PageHero,
};
