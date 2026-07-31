import { Check, ArrowRight } from "lucide-react";
import { COLORS } from "../theme";
import { PlusPattern } from "../components/Patterns";
import { PageHero } from "../components/ui";
import { PricingCard } from "../components/cards";
import { PLANS } from "../data";

function PricingPage({ setPage }) {
  return (
    <div style={{ position: "relative" }}>
      <PlusPattern style={{ top: 60, left: 0, color: COLORS.red, opacity: 0.12 }} />
      <PageHero eyebrow="ราคา" title="เลือกแพ็กเกจที่" gradientWord="เหมาะกับขนาดของคุณ" desc="เริ่มต้นฟรีสำหรับใช้งานส่วนตัว หรืออัปเกรดเป็นทีมเมื่อสำนักงานของคุณเติบโตขึ้น ยกเลิกหรือเปลี่ยนแพ็กเกจได้ทุกเมื่อ" />
      <section style={{ position: "relative", zIndex: 2, maxWidth: 1100, margin: "0 auto", padding: "20px 24px 100px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
        {PLANS.map((plan, i) => (
          <PricingCard key={plan.name} plan={plan} delay={i * 90} setPage={setPage} />
        ))}
      </section>
    </div>
  );
}
export default PricingPage;
