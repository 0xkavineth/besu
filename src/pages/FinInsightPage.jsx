import { LineChart,Receipt,FileCheck2,History,Users,FolderLock } from "lucide-react";
import { GRADIENT_PURPLE, COLORS } from "../theme";
import AppProductPage from "../components/AppProductPage";

function FinInsightPage({ setPage }) {
  return (
    <AppProductPage
      setPage={setPage}
      appKey="fininsight"
      icon={LineChart}
      eyebrowLabel="FinInsight · แอปวิเคราะห์การเงิน"
      titleLine1="เห็นภาพการเงินชัดเจน"
      gradientWordLine2="ตัดสินใจได้เร็วขึ้น"
      desc="FinInsight รวมแดชบอร์ดวิเคราะห์งบการเงินและกระแสเงินสดแบบเรียลไทม์ ช่วยให้นักวิเคราะห์การเงินมองเห็นภาพรวมได้ในที่เดียว"
      gradient={GRADIENT_PURPLE} soft={COLORS.purpleSoft} soft2={COLORS.purpleSoft2} colorDark={COLORS.purpleDark} shadow="139,92,246"
      roleChips={["นักวิเคราะห์การเงิน", "ผู้บริหารสำนักงาน", "ที่ปรึกษาการลงทุน"]}
      features={[
        { icon: LineChart, title: "แดชบอร์ดวิเคราะห์งบการเงิน", desc: "ดูอัตราส่วนทางการเงินสำคัญและแนวโน้มได้แบบเรียลไทม์" },
        { icon: Receipt, title: "ติดตามกระแสเงินสด", desc: "คาดการณ์กระแสเงินสดล่วงหน้าเพื่อวางแผนสภาพคล่อง" },
        { icon: FileCheck2, title: "สร้างรายงานสำหรับผู้บริหาร", desc: "สรุปผลการดำเนินงานเป็นรายงานที่อ่านง่ายส่งได้ทันที" },
        { icon: History, title: "เปรียบเทียบผลประกอบการย้อนหลัง", desc: "ดูแนวโน้มย้อนหลังหลายปีเพื่อประกอบการตัดสินใจ" },
        { icon: Users, title: "แชร์ผลวิเคราะห์กับทีม", desc: "ส่งรายงานและแดชบอร์ดให้ทีมหรือผู้บริหารดูพร้อมกันได้" },
        { icon: FolderLock, title: "เชื่อมข้อมูลจากบัญชีโดยตรง", desc: "ดึงข้อมูลจาก AccounTrack มาวิเคราะห์ได้โดยไม่ต้องคีย์ซ้ำ" },
      ]}
      stats={[
        { label: "รายงานที่สร้างต่อเดือน", value: 54000, suffix: "+" },
        { label: "นักวิเคราะห์การเงินที่ใช้งาน", value: 3200, suffix: "+" },
        { label: "เวลาที่ประหยัดได้ต่อรายงาน", value: 3, suffix: " ชม." },
      ]}
      closingTitle="เห็นภาพการเงินที่ชัดเจนขึ้นวันนี้"
      closingDesc="เริ่มทดลองใช้ FinInsight ฟรี 14 วัน ไม่ต้องใช้บัตรเครดิต"
    />
  );
}

// ---------------------------------------------
// PRICING PAGE
// ---------------------------------------------
export default FinInsightPage;
