import { Landmark,Calculator,History,FileCheck2,FolderLock,Users } from "lucide-react";
import { GRADIENT_GREEN, COLORS } from "../theme";
import AppProductPage from "../components/AppProductPage";

function TaxPlanPage({ setPage }) {
  return (
    <AppProductPage
      setPage={setPage}
      appKey="taxplan"
      icon={Landmark}
      eyebrowLabel="TaxPlan Pro · แอปวางแผนภาษี"
      titleLine1="วางแผนภาษีล่วงหน้า"
      gradientWordLine2="ก่อนยื่นจริงทุกครั้ง"
      desc="TaxPlan Pro ช่วยจำลองสถานการณ์ภาษีหลายรูปแบบ เปรียบเทียบทางเลือก และวางแผนลดหย่อนก่อนถึงกำหนดยื่นจริง"
      gradient={GRADIENT_GREEN} soft={COLORS.greenSoft} soft2={COLORS.greenSoft2} colorDark={COLORS.greenDark} shadow="22,163,74"
      roleChips={["นักวางแผนภาษี", "นักบัญชี", "ที่ปรึกษาการเงิน"]}
      features={[
        { icon: Landmark, title: "จำลองสถานการณ์ภาษี", desc: "เปรียบเทียบแผนภาษีหลายรูปแบบก่อนตัดสินใจยื่นจริง" },
        { icon: Calculator, title: "คำนวณค่าลดหย่อนอัตโนมัติ", desc: "อัปเดตเกณฑ์ลดหย่อนล่าสุด คำนวณให้ทันทีแบบไม่ต้องจำเอง" },
        { icon: History, title: "ติดตามกำหนดยื่นภาษี", desc: "แจ้งเตือนกำหนดยื่นภาษีแต่ละประเภทล่วงหน้าอัตโนมัติ" },
        { icon: FileCheck2, title: "สร้างรายงานสรุปแผนภาษี", desc: "ส่งออกรายงานเปรียบเทียบแผนให้ลูกค้าตัดสินใจได้ง่ายขึ้น" },
        { icon: FolderLock, title: "จัดเก็บเอกสารภาษีเข้ารหัส", desc: "เอกสารประกอบการยื่นภาษีถูกเข้ารหัสและเรียกดูย้อนหลังได้" },
        { icon: Users, title: "ทำงานร่วมกับทีมบัญชี", desc: "เชื่อมข้อมูลกับ AccounTrack เพื่อวางแผนภาษีจากข้อมูลจริง" },
      ]}
      stats={[
        { label: "แผนภาษีที่จำลองไว้", value: 98000, suffix: "+" },
        { label: "ที่ปรึกษาภาษีที่ใช้งาน", value: 2100, suffix: "+" },
        { label: "ค่าเฉลี่ยภาษีที่ประหยัดได้ต่อแผน", value: 12, suffix: "%" },
      ]}
      closingTitle="วางแผนภาษีปีนี้ให้รอบคอบขึ้น"
      closingDesc="เริ่มทดลองใช้ TaxPlan Pro ฟรี 14 วัน ไม่ต้องใช้บัตรเครดิต"
    />
  );
}
export default TaxPlanPage;
