import { Monitor, Laptop, Puzzle, Download as DownloadIcon } from "lucide-react";
import { COLORS } from "../theme";
import { DotGridPattern } from "../components/Patterns";
import { PageHero } from "../components/ui";
import { DownloadCard } from "../components/cards";
import { DOWNLOADS } from "../data";

function DownloadPage() {
  return (
    <div style={{ position: "relative" }}>
      <DotGridPattern style={{ top: 60, left: 0, color: COLORS.red, opacity: 0.14 }} />
      <PageHero eyebrow="ดาวน์โหลด" title="ใช้งาน Obfice Base" gradientWord="บนอุปกรณ์ที่คุณถนัด" desc="เลือกโปรแกรมสำหรับเดสก์ท็อป หรือติดตั้งส่วนขยายเบราว์เซอร์เพื่อบันทึกเอกสารจากเว็บได้ทันที ทุกช่องทางเข้ารหัสข้อมูลมาตรฐานเดียวกัน" />
      <section style={{ position: "relative", zIndex: 2, maxWidth: 1100, margin: "0 auto", padding: "20px 24px 100px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 20 }}>
        {DOWNLOADS.map((d, i) => (
          <DownloadCard key={d.name} d={d} delay={i * 100} />
        ))}
      </section>
    </div>
  );
}

// ---------------------------------------------
// CONTACT PAGE
// ---------------------------------------------
export default DownloadPage;
