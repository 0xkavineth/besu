import { ChevronDown, Sparkles, ArrowRight, Lock, KeyRound, Users, FileCheck2 } from "lucide-react";
import { COLORS, GRADIENT_BRAND } from "../theme";
import { useScrollY } from "../hooks";
import { FloatingIcons, AmbientBlobs } from "../components/Patterns";
import { SectionEyebrow, PrimaryButton, GhostButton, RoleChip, FeatureCard, StatBlock } from "../components/ui";
import TrustMarquee from "../components/TrustMarquee";
import PillarsSection from "../components/PillarsSection";
import AppShowcaseSection from "../components/AppShowcaseSection";

function HomePage({ setPage }) {
  const scrollY = useScrollY();
  const heroOpacity = Math.max(1 - scrollY / 420, 0.25);
  const heroScale = Math.max(1 - scrollY / 5000, 0.94);
  const heroLift = Math.min(scrollY * 0.12, 50);
  const cueOpacity = Math.max(1 - scrollY / 120, 0);

  return (
    <>
      <div style={{ position: "relative" }}>
        <FloatingIcons />
        <AmbientBlobs />
        <header
          style={{
            position: "relative", zIndex: 2, maxWidth: 900, margin: "0 auto", textAlign: "center", padding: "100px 24px 40px",
            opacity: heroOpacity, transform: `translateY(${-heroLift}px) scale(${heroScale})`, willChange: "transform, opacity",
          }}
        >
          <div className="fade-up" style={{ animationDelay: "0ms" }}>
            <SectionEyebrow>
              <Sparkles size={13} style={{ animation: "pulseSoft 2.4s ease-in-out infinite" }} /> เข้ารหัสข้อมูลระดับองค์กร ตั้งแต่ต้นทางถึงปลายทาง
            </SectionEyebrow>
          </div>
          <h1 className="fade-up" style={{ animationDelay: "80ms", fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.4rem, 5.5vw, 4.2rem)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.15, margin: 0 }}>
            รวมทุกแอปสำหรับสำนักงาน<br />
            <span style={{ background: GRADIENT_BRAND, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              ไว้ในที่เดียว ปลอดภัยตั้งแต่วันแรก
            </span>
          </h1>
          <p className="fade-up" style={{ animationDelay: "160ms", marginTop: 22, fontSize: "1.05rem", color: COLORS.textDim, maxWidth: 580, margin: "22px auto 0", lineHeight: 1.7 }}>
            แพลตฟอร์มเดียวสำหรับนักบัญชี นักกฎหมาย นักวางแผนภาษี และนักวิเคราะห์การเงิน
            ข้อมูลลูกค้าถูกเข้ารหัสตลอดเวลา พร้อมระบบสมาชิกแบบแบ่งสิทธิ์การเข้าถึงตามบทบาท
          </p>
          <div className="fade-up" style={{ animationDelay: "240ms", marginTop: 34, display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <PrimaryButton>เริ่มใช้งานฟรี 14 วัน <ArrowRight size={16} /></PrimaryButton>
            <GhostButton onClick={() => setPage("pricing")}>ดูแพ็กเกจราคา</GhostButton>
          </div>
          <div className="fade-up" style={{ animationDelay: "320ms", marginTop: 46, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <RoleChip label="นักบัญชี" />
            <RoleChip label="นักกฎหมาย" />
            <RoleChip label="นักวางแผนภาษี" />
            <RoleChip label="นักวิเคราะห์การเงิน" />
            <RoleChip label="ผู้บริหารสำนักงาน" />
          </div>
        </header>

        <div style={{
          position: "relative", zIndex: 2, display: "flex", justifyContent: "center",
          opacity: cueOpacity, pointerEvents: "none", marginTop: -10, marginBottom: 10,
        }}>
          <div style={{ animation: "scrollCue 1.6s ease-in-out infinite" }}>
            <ChevronDown size={20} color={COLORS.textDim} />
          </div>
        </div>
      </div>

      <AppShowcaseSection setPage={setPage} />
      <TrustMarquee />
      <PillarsSection setPage={setPage} />

      <section style={{ position: "relative", zIndex: 2, maxWidth: 1180, margin: "0 auto", padding: "30px 24px 20px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 18 }}>
        <FeatureCard delay={0} icon={Lock} eyebrow="เข้ารหัสข้อมูล" title="Encrypted by default" desc="ไฟล์และข้อมูลลูกค้าทุกชิ้นถูกเข้ารหัสทั้งขณะจัดเก็บและขณะส่งผ่านเครือข่าย" />
        <FeatureCard delay={80} icon={KeyRound} eyebrow="ระบบสมาชิก" title="สมัครสมาชิกตามทีม" desc="กำหนดสิทธิ์การเข้าถึงตามบทบาท เลือกแพ็กเกจรายเดือนหรือรายปี" />
        <FeatureCard delay={160} icon={Users} eyebrow="รวมทุกวิชาชีพ" title="แอปเฉพาะทางในที่เดียว" desc="เครื่องมือสำหรับงานบัญชี กฎหมาย ภาษี และการวิเคราะห์การเงิน เชื่อมข้อมูลถึงกัน" />
        <FeatureCard delay={240} icon={FileCheck2} eyebrow="ตรวจสอบได้" title="Audit trail ครบถ้วน" desc="ทุกการเข้าถึงและแก้ไขเอกสารถูกบันทึกไว้ ตรวจสอบย้อนหลังได้ทุกเมื่อ" />
      </section>

      <section style={{ position: "relative", zIndex: 2, borderTop: `1px solid ${COLORS.cardBorder}`, borderBottom: `1px solid ${COLORS.cardBorder}`, background: COLORS.redSoft }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "56px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 32 }}>
          <StatBlock label="สำนักงานที่ใช้งานอยู่" value={3200} suffix="+" />
          <StatBlock label="ผู้ใช้งานมืออาชีพ" value={18500} suffix="+" />
          <StatBlock label="เอกสารที่เข้ารหัสไว้" value={2400000} suffix="+" />
          <StatBlock label="Uptime เฉลี่ย" value={99} suffix=".98%" />
        </div>
      </section>
    </>
  );
}

// ---------------------------------------------
// APPS PAGE
// ---------------------------------------------
export default HomePage;
