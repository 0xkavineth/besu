import { COLORS } from "../theme";
import { DotGridPattern } from "./Patterns";
import { SectionEyebrow, GhostButton, FeatureCard, StatBlock, PrimaryButton, OpenAppButton } from "./ui";
import { ArrowRight } from "lucide-react";

function AppProductPage({
  setPage, appKey, icon: HeroIcon, eyebrowLabel, titleLine1, gradientWordLine2, desc,
  gradient, soft, soft2, colorDark, shadow, roleChips, features, stats, closingTitle, closingDesc,
}) {
  return (
    <div style={{ position: "relative" }}>
      <div className="float-slow" style={{
        position: "absolute", top: -240, left: -140, width: 560, height: 560,
        background: `radial-gradient(circle, ${soft2} 0%, transparent 70%)`,
        filter: "blur(10px)", pointerEvents: "none",
      }} />
      <DotGridPattern style={{ top: 100, right: 0, color: colorDark, opacity: 0.14 }} />

      <header style={{ position: "relative", zIndex: 2, maxWidth: 860, margin: "0 auto", textAlign: "center", padding: "90px 24px 30px" }}>
        <SectionEyebrow soft={soft} soft2={soft2} colorDark={colorDark}>
          <HeroIcon size={13} /> {eyebrowLabel}
        </SectionEyebrow>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.2rem, 5vw, 3.8rem)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.18, margin: 0 }}>
          {titleLine1}<br />
          <span style={{ background: gradient, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            {gradientWordLine2}
          </span>
        </h1>
        <p style={{ marginTop: 20, fontSize: "1.02rem", color: COLORS.textDim, maxWidth: 580, margin: "20px auto 0", lineHeight: 1.7 }}>{desc}</p>
        <div style={{ marginTop: 32, display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <OpenAppButton appName={eyebrowLabel.split(" ·")[0]} appKey={appKey} setPage={setPage} gradient={gradient} soft={soft} shadow={shadow} />
          <GhostButton onClick={() => setPage("contact")}>ขอเดโมสำหรับสำนักงาน</GhostButton>
        </div>
        <div style={{ marginTop: 40, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          {roleChips.map((r, i) => (
            <div key={r} className="fade-up" style={{ animationDelay: `${i * 70}ms`, border: `1px solid ${soft2}`, borderRadius: 999, padding: "8px 16px", fontSize: "0.85rem", fontWeight: 600, color: colorDark, background: soft, whiteSpace: "nowrap" }}>{r}</div>
          ))}
        </div>
      </header>

      <section style={{ position: "relative", zIndex: 2, maxWidth: 1180, margin: "0 auto", padding: "60px 24px 90px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 18 }}>
        {features.map((f, i) => (
          <FeatureCard key={f.title} delay={i * 60} icon={f.icon} eyebrow={eyebrowLabel.split(" ·")[0]} title={f.title} desc={f.desc} color={colorDark} soft={soft} soft2={soft2} />
        ))}
      </section>

      <section style={{ position: "relative", zIndex: 2, borderTop: `1px solid ${COLORS.cardBorder}`, borderBottom: `1px solid ${COLORS.cardBorder}`, background: soft }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "50px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 32 }}>
          {stats.map((s) => <StatBlock key={s.label} label={s.label} value={s.value} suffix={s.suffix} />)}
        </div>
      </section>

      <section style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "60px 24px 100px" }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.4rem", fontWeight: 700, marginBottom: 14 }}>{closingTitle}</div>
        <p style={{ color: COLORS.textDim, maxWidth: 480, margin: "0 auto 26px", lineHeight: 1.7 }}>{closingDesc}</p>
        <PrimaryButton gradient={gradient} shadow={shadow} style={{ margin: "0 auto" }} onClick={() => setPage("signup")}>
          เริ่มใช้ {eyebrowLabel.split(" ·")[0]} <ArrowRight size={16} />
        </PrimaryButton>
      </section>
    </div>
  );
}
export default AppProductPage;
