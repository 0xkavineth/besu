import { COLORS } from "../theme";
import { DotGridPattern } from "../components/Patterns";
import { PageHero, FeatureCard } from "../components/ui";
import { APPS, APP_PAGE_MAP } from "../data";

function AppsPage({ setPage }) {
  return (
    <div style={{ position: "relative" }}>
      <DotGridPattern style={{ top: 60, left: 0, color: COLORS.red, opacity: 0.14 }} />
      <PageHero eyebrow="แอปทั้งหมด" title="ชุดแอปพลิเคชัน" gradientWord="สำหรับทุกงานในสำนักงาน" desc="เลือกใช้เฉพาะแอปที่จำเป็น หรือรวมทุกแอปไว้ในแพ็กเกจเดียว ทุกแอปเชื่อมข้อมูลถึงกันและเข้ารหัสเหมือนกันทั้งหมด" />
      <section style={{ position: "relative", zIndex: 2, maxWidth: 1180, margin: "0 auto", padding: "20px 24px 100px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 18 }}>
        {APPS.map((app, i) => {
          const mapped = APP_PAGE_MAP[app.name];
          return (
            <FeatureCard
              key={app.name}
              delay={i * 40}
              icon={app.icon}
              eyebrow={app.tag}
              title={app.name}
              desc={app.desc}
              color={mapped ? mapped.color : COLORS.red}
              soft={mapped ? mapped.soft : COLORS.redSoft}
              soft2={mapped ? mapped.soft2 : COLORS.redSoft2}
              onClick={mapped ? () => setPage(mapped.key) : undefined}
            />
          );
        })}
      </section>
    </div>
  );
}

// ---------------------------------------------
// LEXCASE PAGE — dedicated product page, orange theme
// ---------------------------------------------
export default AppsPage;
