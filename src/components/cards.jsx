import { useState } from "react";
import { ChevronDown, Check, ArrowRight, Download as DownloadIcon } from "lucide-react";
import { COLORS, GRADIENT_BRAND } from "../theme";
import { useInView } from "../hooks";
import { PrimaryButton, GhostButton } from "./ui";

function FAQItem({ q, a, isOpen, onClick }) {
  return (
    <div style={{ border: `1px solid ${COLORS.cardBorder}`, borderRadius: 14, overflow: "hidden" }}>
      <button onClick={onClick} style={{
        width: "100%", background: isOpen ? COLORS.cardAlt : COLORS.card, border: "none", cursor: "pointer",
        padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
        textAlign: "left", fontSize: "0.95rem", fontWeight: 600, color: COLORS.text, transition: "background 200ms ease",
      }}>
        {q}
        <ChevronDown size={18} color={COLORS.red} style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 300ms cubic-bezier(0.4,0,0.2,1)", flexShrink: 0, marginLeft: 12 }} />
      </button>
      <div style={{ display: "grid", gridTemplateRows: isOpen ? "1fr" : "0fr", transition: "grid-template-rows 320ms cubic-bezier(0.4,0,0.2,1)" }}>
        <div style={{ overflow: "hidden" }}>
          <div style={{ padding: "0 20px 18px", fontSize: "0.88rem", color: COLORS.textDim, lineHeight: 1.7, opacity: isOpen ? 1 : 0, transition: "opacity 260ms ease" }}>{a}</div>
        </div>
      </div>
    </div>
  );
}

function DownloadCard({ d, delay }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{
      background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 20, padding: "30px 26px",
      display: "flex", flexDirection: "column", gap: 16,
      opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(18px)",
      transition: `opacity 600ms ease ${delay}ms, transform 600ms ease ${delay}ms`,
    }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: COLORS.redSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <d.icon size={22} color={COLORS.red} />
      </div>
      <div>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.2rem", fontWeight: 700 }}>{d.name}</div>
        <div style={{ fontSize: "0.8rem", color: COLORS.textDim, marginTop: 4 }}>{d.version} · {d.size}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {d.points.map((p) => (
          <div key={p} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: "0.85rem", color: COLORS.textDim }}>
            <Check size={15} color={COLORS.red} style={{ flexShrink: 0, marginTop: 2 }} /> {p}
          </div>
        ))}
      </div>
      <PrimaryButton style={{ justifyContent: "center", width: "100%", marginTop: 4 }}>
        ดาวน์โหลด <DownloadIcon size={16} />
      </PrimaryButton>
    </div>
  );
}

function PricingCard({ plan, delay, setPage }) {
  const [ref, inView] = useInView();
  const [hover, setHover] = useState(false);
  return (
    <div
      ref={ref}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: COLORS.card, borderRadius: 20, padding: "30px 26px",
        border: plan.highlight ? `2px solid ${COLORS.red}` : `1px solid ${COLORS.cardBorder}`,
        boxShadow: plan.highlight ? `0 20px 40px -18px ${COLORS.redSoft2}` : (hover ? "0 16px 32px -14px rgba(20,18,30,0.14)" : "0 1px 2px rgba(20,18,30,0.04)"),
        display: "flex", flexDirection: "column", gap: 18, position: "relative",
        opacity: inView ? 1 : 0,
        transform: inView ? (hover ? "translateY(-6px)" : "translateY(0)") : "translateY(18px)",
        transition: `opacity 600ms ease ${delay}ms, transform ${inView ? "220ms ease" : `600ms ease ${delay}ms`}, box-shadow 220ms ease`,
      }}
    >
      {plan.highlight && (
        <div style={{
          position: "absolute", top: -12, left: 26, background: COLORS.red, color: "#fff",
          fontSize: "0.7rem", fontWeight: 700, padding: "4px 12px", borderRadius: 999,
          animation: "badgePulse 2.2s ease-in-out infinite",
        }}>
          ยอดนิยม
        </div>
      )}
      <div style={{ fontSize: "0.8rem", fontWeight: 700, color: COLORS.red }}>{plan.name}</div>
      <div>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "2rem", fontWeight: 700 }}>{plan.price}</span>
        <span style={{ fontSize: "0.85rem", color: COLORS.textDim }}>{plan.period}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {plan.features.map((f) => (
          <div key={f} style={{ display: "flex", gap: 8, alignItems: "flex-start", fontSize: "0.88rem", color: COLORS.textDim }}>
            <Check size={16} color={COLORS.red} style={{ flexShrink: 0, marginTop: 2 }} /> {f}
          </div>
        ))}
      </div>
      {plan.highlight ? (
        <PrimaryButton style={{ justifyContent: "center", width: "100%" }}>เริ่มใช้งาน <ArrowRight size={16} /></PrimaryButton>
      ) : (
        <GhostButton style={{ width: "100%" }} onClick={() => setPage("contact")}>
          {plan.price === "ติดต่อฝ่ายขาย" ? "ติดต่อฝ่ายขาย" : "เริ่มใช้งานฟรี"}
        </GhostButton>
      )}
    </div>
  );
}

// ---------------------------------------------
// SECURITY PAGE
// ---------------------------------------------
export { FAQItem, DownloadCard, PricingCard };
