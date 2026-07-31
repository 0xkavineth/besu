import { COLORS } from "../theme";
import { DotGridPattern } from "../components/Patterns";
import { PageHero, FeatureCard } from "../components/ui";
import { SECURITY_ITEMS } from "../data";

function SecurityPage() {
  return (
    <div style={{ position: "relative" }}>
      <DotGridPattern style={{ top: 80, right: 0, color: COLORS.red, opacity: 0.14 }} />
      <PageHero eyebrow="ความปลอดภัย" title="ข้อมูลของคุณ" gradientWord="ถูกปกป้องทุกชั้น" desc="ความปลอดภัยของข้อมูลลูกค้าคือหัวใจของ Obfice Base เราออกแบบระบบตั้งแต่ต้นให้เข้ารหัสโดยค่าเริ่มต้น ไม่ใช่ตัวเลือกเสริม" />
      <section style={{ position: "relative", zIndex: 2, maxWidth: 1180, margin: "0 auto", padding: "20px 24px 100px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18 }}>
        {SECURITY_ITEMS.map((item, i) => (
          <FeatureCard key={item.title} delay={i * 40} icon={item.icon} eyebrow="ความปลอดภัย" title={item.title} desc={item.desc} />
        ))}
      </section>
    </div>
  );
}

// ---------------------------------------------
// RESOURCES + FAQ PAGE
// ---------------------------------------------
export default SecurityPage;
