import { useState } from "react";
import { COLORS } from "../theme";
import { PlusPattern } from "../components/Patterns";
import { PageHero, FeatureCard } from "../components/ui";
import { FAQItem } from "../components/cards";
import { RESOURCE_CARDS, FAQS } from "../data";

function ResourcesPage() {
  const [openIndex, setOpenIndex] = useState(0);
  return (
    <div style={{ position: "relative" }}>
      <PlusPattern style={{ bottom: 30, right: 0, color: COLORS.red, opacity: 0.12 }} />
      <PageHero eyebrow="แหล่งข้อมูล" title="คู่มือ ความช่วยเหลือ" gradientWord="และคำถามที่พบบ่อย" desc="รวมทุกอย่างที่ช่วยให้ทีมของคุณเริ่มต้นและใช้งาน Obfice Base ได้อย่างราบรื่น" />

      <section style={{ position: "relative", zIndex: 2, maxWidth: 1000, margin: "0 auto", padding: "10px 24px 50px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 18 }}>
        {RESOURCE_CARDS.map((r, i) => (
          <FeatureCard key={r.title} delay={i * 60} icon={r.icon} eyebrow="แหล่งข้อมูล" title={r.title} desc={r.desc} />
        ))}
      </section>

      <section style={{ position: "relative", zIndex: 2, maxWidth: 720, margin: "0 auto", padding: "20px 24px 100px" }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.3rem", marginBottom: 20, textAlign: "center" }}>คำถามที่พบบ่อย</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {FAQS.map((item, i) => (
            <FAQItem key={item.q} q={item.q} a={item.a} isOpen={openIndex === i} onClick={() => setOpenIndex(openIndex === i ? -1 : i)} />
          ))}
        </div>
      </section>
    </div>
  );
}

// ---------------------------------------------
// DOWNLOAD PAGE
// ---------------------------------------------
export default ResourcesPage;
