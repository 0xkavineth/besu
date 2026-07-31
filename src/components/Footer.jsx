import { COLORS } from "../theme";
import Logo from "./Logo";
import { Github, Twitter } from "lucide-react";

function Footer({ setPage }) {
  return (
    <footer style={{ position: "relative", zIndex: 2, borderTop: `1px solid ${COLORS.cardBorder}` }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "48px 24px 32px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 24 }}>
        <div>
          <div style={{ marginBottom: 10 }}><Logo size="1.05rem" iconSize={22} /></div>
          <div style={{ fontSize: "0.82rem", color: COLORS.textDim, lineHeight: 1.7 }}>แพลตฟอร์มรวมแอปสำหรับสำนักงานวิชาชีพ เข้ารหัสข้อมูลทุกชั้น</div>
        </div>
        {[
          { title: "ผลิตภัณฑ์", items: [["apps", "แอปทั้งหมด"], ["security", "ความปลอดภัย"], ["download", "ดาวน์โหลดโปรแกรม"]] },
          { title: "บริษัท", items: [["pricing", "ราคา"], ["contact", "ติดต่อเรา"]] },
          { title: "แหล่งข้อมูล", items: [["resources", "ศูนย์ช่วยเหลือ"], ["resources", "คำถามที่พบบ่อย"]] },
        ].map((col) => (
          <div key={col.title}>
            <div style={{ fontSize: "0.78rem", fontWeight: 700, color: COLORS.text, marginBottom: 12 }}>{col.title}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {col.items.map(([key, label], i) => (
                <span key={label + i} onClick={() => setPage(key)} style={{ fontSize: "0.85rem", color: COLORS.textDim, cursor: "pointer" }}>{label}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "20px 24px", borderTop: `1px solid ${COLORS.cardBorder}`, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ fontSize: "0.8rem", color: COLORS.textDim }}>© 2026 Obfice Base. แนวคิด UI ตัวอย่างสำหรับการนำเสนอเท่านั้น</div>
        <div style={{ display: "flex", gap: 18, color: COLORS.textDim }}><Github size={17} /><Twitter size={17} /></div>
      </div>
    </footer>
  );
}

// ---------------------------------------------
// HOME PAGE — with subtle motion
// ---------------------------------------------
export default Footer;
