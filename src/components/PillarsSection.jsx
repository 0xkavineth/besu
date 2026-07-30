import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { COLORS } from "../theme";
import { useInView } from "../hooks";
import { BracketLabel } from "./ui";
import { PILLARS } from "../data";

function PillarItem({ p, i, setPage }) {
  const [ref, inView] = useInView();
  const [hover, setHover] = useState(false);
  return (
    <div
      ref={ref}
      onClick={() => setPage(p.link)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: COLORS.card, border: `1px solid ${hover ? COLORS.red : COLORS.cardBorder}`, borderRadius: 20,
        padding: "30px 26px", cursor: "pointer",
        opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(18px)",
        transition: `opacity 600ms ease ${i * 100}ms, transform 600ms ease ${i * 100}ms, border-color 200ms ease, box-shadow 200ms ease`,
        boxShadow: hover ? `0 16px 32px -14px ${COLORS.redSoft2}` : "0 1px 2px rgba(20,18,30,0.04)",
      }}
    >
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "2.6rem", fontWeight: 700, lineHeight: 1, color: "transparent", WebkitTextStroke: `1.5px ${COLORS.redSoft2}` }}>
        {p.num}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 14, marginBottom: 8 }}>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: COLORS.text }}>{p.title}</span>
        <ArrowRight size={15} color={COLORS.red} style={{ transform: hover ? "translateX(4px)" : "translateX(0)", transition: "transform 200ms ease" }} />
      </div>
      <div style={{ fontSize: "0.88rem", color: COLORS.textDim, lineHeight: 1.7 }}>{p.desc}</div>
    </div>
  );
}

function PillarsSection({ setPage }) {
  return (
    <section style={{ position: "relative", zIndex: 2, maxWidth: 1180, margin: "0 auto", padding: "80px 24px 30px" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <BracketLabel style={{ display: "inline-block" }}>OBFICE STACK IS UNIFIED</BracketLabel>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.7rem, 4vw, 2.5rem)", fontWeight: 700, letterSpacing: "-0.02em" }}>
          หนึ่งแพลตฟอร์ม หนึ่งบัญชี หนึ่งทีม
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>
        {PILLARS.map((p, i) => <PillarItem key={p.num} p={p} i={i} setPage={setPage} />)}
      </div>
    </section>
  );
}

// ---------------------------------------------
// App Showcase — auto-rotating stacked-card carousel (center card sharp, neighbors peek out)
// ---------------------------------------------
export default PillarsSection;
