import {
  Scale, ArrowRight, History, FolderLock, FileSignature, Users, Receipt,
} from "lucide-react";
import { COLORS, GRADIENT_ORANGE } from "../theme";
import { DotGridPattern } from "../components/Patterns";
import { SectionEyebrow, GhostButton, FeatureCard, StatBlock, PrimaryButton, OpenAppButton } from "../components/ui";

const LEXCASE_FEATURES = [
  { icon: Scale, title: "จัดการคดีความเป็นระบบ", desc: "รวมข้อมูลคดี คู่ความ และเอกสารทั้งหมดไว้ในหน้าเดียวต่อคดี ค้นหาย้อนหลังได้ทันที" },
  { icon: History, title: "ไทม์ไลน์คดีอัตโนมัติ", desc: "บันทึกความเคลื่อนไหวของคดีตามลำดับเวลา ตั้งแต่รับเรื่องจนถึงคำพิพากษา" },
  { icon: FolderLock, title: "แยกพื้นที่เอกสารรายลูกความ", desc: "เอกสารของลูกความแต่ละรายถูกเข้ารหัสและแยกจากกันโดยสมบูรณ์" },
  { icon: FileSignature, title: "ติดตามนัดศาลและกำหนดเวลา", desc: "แจ้งเตือนวันนัดพิจารณาคดีและกำหนดยื่นเอกสารล่วงหน้าอัตโนมัติ" },
  { icon: Users, title: "มอบหมายงานในทีมกฎหมาย", desc: "แบ่งงานให้ทนายความและผู้ช่วยตามคดี พร้อมติดตามความคืบหน้า" },
  { icon: Receipt, title: "บันทึกชั่วโมงทำงานต่อคดี", desc: "คิดค่าบริการตามชั่วโมงทำงานจริง และออกใบแจ้งหนี้แยกตามคดีได้ทันที" },
];

function LexCasePage({ setPage }) {
  return (
    <div style={{ position: "relative" }}>
      {/* Orange ambient backdrop, unique to this product page */}
      <div className="float-slow" style={{
        position: "absolute", top: -240, left: -140, width: 560, height: 560,
        background: "radial-gradient(circle, rgba(249,115,22,0.16) 0%, rgba(249,115,22,0) 70%)",
        filter: "blur(10px)", pointerEvents: "none",
      }} />
      <div className="float-slower" style={{
        position: "absolute", top: -160, right: -160, width: 560, height: 560,
        background: "radial-gradient(circle, rgba(194,65,12,0.12) 0%, rgba(194,65,12,0) 70%)",
        filter: "blur(10px)", pointerEvents: "none",
      }} />
      <DotGridPattern style={{ top: 100, right: 0, color: COLORS.orange, opacity: 0.16 }} />

      <header style={{ position: "relative", zIndex: 2, maxWidth: 860, margin: "0 auto", textAlign: "center", padding: "90px 24px 30px" }}>
        <SectionEyebrow soft={COLORS.orangeSoft} soft2={COLORS.orangeSoft2} colorDark={COLORS.orangeDark}>
          <Scale size={13} /> LexCase · แอปสำหรับสำนักงานกฎหมายโดยเฉพาะ
        </SectionEyebrow>
        <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(2.2rem, 5vw, 3.8rem)", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.18, margin: 0 }}>
          จัดการคดีความอย่างเป็นระบบ<br />
          <span style={{ background: GRADIENT_ORANGE, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            ไม่พลาดทุกนัดสำคัญ
          </span>
        </h1>
        <p style={{ marginTop: 20, fontSize: "1.02rem", color: COLORS.textDim, maxWidth: 580, margin: "20px auto 0", lineHeight: 1.7 }}>
          LexCase ออกแบบมาเพื่อทนายความและสำนักงานกฎหมายโดยเฉพาะ ตั้งแต่การจัดการคดี เอกสารลูกความ
          ไปจนถึงการติดตามนัดศาล ทุกข้อมูลเข้ารหัสและแยกเก็บเป็นรายคดี
        </p>
        <div style={{ marginTop: 32, display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <OpenAppButton appName="LexCase" appKey="lexcase" setPage={setPage} gradient={GRADIENT_ORANGE} soft={COLORS.orangeSoft} shadow="249,115,22" appRoute="app-lexcase" />
          <GhostButton onClick={() => setPage("contact")}>ขอเดโมสำหรับสำนักงาน</GhostButton>
        </div>
        <div style={{ marginTop: 40, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          {["ทนายความ", "ผู้ช่วยทนายความ", "สำนักงานกฎหมายขนาดเล็ก-กลาง"].map((r, i) => (
            <div key={r} className="fade-up" style={{ animationDelay: `${i * 70}ms`, border: `1px solid ${COLORS.orangeSoft2}`, borderRadius: 999, padding: "8px 16px", fontSize: "0.85rem", fontWeight: 600, color: COLORS.orangeDark, background: COLORS.orangeSoft, whiteSpace: "nowrap" }}>
              {r}
            </div>
          ))}
        </div>
      </header>

      <section style={{ position: "relative", zIndex: 2, maxWidth: 1180, margin: "0 auto", padding: "60px 24px 90px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 18 }}>
        {LEXCASE_FEATURES.map((f, i) => (
          <FeatureCard key={f.title} delay={i * 60} icon={f.icon} eyebrow="LexCase" title={f.title} desc={f.desc} color={COLORS.orange} soft={COLORS.orangeSoft} soft2={COLORS.orangeSoft2} />
        ))}
      </section>

      <section style={{ position: "relative", zIndex: 2, borderTop: `1px solid ${COLORS.cardBorder}`, borderBottom: `1px solid ${COLORS.cardBorder}`, background: COLORS.orangeSoft }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "50px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 32 }}>
          <StatBlock label="คดีที่จัดการอยู่ในระบบ" value={41000} suffix="+" />
          <StatBlock label="สำนักงานกฎหมายที่ใช้งาน" value={860} suffix="+" />
          <StatBlock label="เวลาที่ประหยัดได้ต่อคดี" value={4} suffix=" ชม./สัปดาห์" />
        </div>
      </section>

      <section style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "60px 24px 100px" }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.4rem", fontWeight: 700, marginBottom: 14 }}>พร้อมให้ทีมกฎหมายของคุณทำงานง่ายขึ้น</div>
        <p style={{ color: COLORS.textDim, maxWidth: 480, margin: "0 auto 26px", lineHeight: 1.7 }}>เริ่มทดลองใช้ LexCase ฟรี 14 วัน ไม่ต้องใช้บัตรเครดิต</p>
        <PrimaryButton gradient={GRADIENT_ORANGE} shadow="249,115,22" style={{ margin: "0 auto" }} onClick={() => setPage("signup")}>
          เริ่มใช้ LexCase <ArrowRight size={16} />
        </PrimaryButton>
      </section>
    </div>
  );
}

// ---------------------------------------------
// Generic themed app-page builder (used by the 3 pages below)
// ---------------------------------------------
export default LexCasePage;
