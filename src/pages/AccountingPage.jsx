import { Calculator,Receipt,FileCheck2,Users,FolderLock,LineChart } from "lucide-react";
import { GRADIENT_BLUE, COLORS } from "../theme";
import AppProductPage from "../components/AppProductPage";

function AccountingPage({ setPage }) {
  return (
    <AppProductPage
      setPage={setPage}
      appKey="accounting"
      icon={Calculator}
      eyebrowLabel="AccounTrack · แอปบัญชีสำหรับสำนักงาน"
      titleLine1="ปิดงบไม่ต้องเร่ง"
      gradientWordLine2="บัญชีแม่นยำทุกเดือน"
      desc="AccounTrack ช่วยบันทึกบัญชี กระทบยอด และปิดงบรายเดือนโดยอัตโนมัติ พร้อมส่งออกรายงานภาษีได้ในไม่กี่คลิก"
      gradient={GRADIENT_BLUE} soft={COLORS.blueSoft} soft2={COLORS.blueSoft2} colorDark={COLORS.blueDark} shadow="14,165,233"
      roleChips={["นักบัญชี", "สำนักงานบัญชี", "เจ้าของกิจการ"]}
      features={[
        { icon: Receipt, title: "บันทึกรายรับ-รายจ่ายอัตโนมัติ", desc: "ดึงข้อมูลจากใบเสร็จและใบแจ้งหนี้ ลดการคีย์ข้อมูลซ้ำซ้อน" },
        { icon: Calculator, title: "กระทบยอดบัญชีธนาคาร", desc: "จับคู่รายการธนาคารกับสมุดบัญชีอัตโนมัติ ลดความผิดพลาด" },
        { icon: FileCheck2, title: "ปิดงบรายเดือนในไม่กี่นาที", desc: "สร้างงบทดลองและงบกำไรขาดทุนพร้อมส่งออกทันที" },
        { icon: Users, title: "แชร์งานในทีมบัญชี", desc: "มอบหมายงานลูกค้าแต่ละรายให้ทีมงาน พร้อมติดตามสถานะ" },
        { icon: FolderLock, title: "จัดเก็บเอกสารบัญชีเข้ารหัส", desc: "ใบเสร็จและเอกสารประกอบบัญชีถูกเข้ารหัสและค้นหาได้ง่าย" },
        { icon: LineChart, title: "รายงานสรุปสำหรับลูกค้า", desc: "สร้างรายงานสรุปการเงินที่เข้าใจง่ายส่งให้ลูกค้าได้ทันที" },
      ]}
      stats={[
        { label: "รายการบัญชีที่บันทึกต่อเดือน", value: 620000, suffix: "+" },
        { label: "สำนักงานบัญชีที่ใช้งาน", value: 1450, suffix: "+" },
        { label: "เวลาที่ประหยัดได้ต่อการปิดงบ", value: 6, suffix: " ชม./เดือน" },
      ]}
      closingTitle="ปิดงบเดือนนี้ให้เสร็จเร็วขึ้น"
      closingDesc="เริ่มทดลองใช้ AccounTrack ฟรี 14 วัน ไม่ต้องใช้บัตรเครดิต"
    />
  );
}
export default AccountingPage;
