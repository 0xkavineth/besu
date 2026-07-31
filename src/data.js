import {
  Users, Scale, Landmark, LineChart, Calculator, ShieldCheck, Download as DownloadIcon,
  FileSignature, FolderLock, Receipt, MessageSquare, Lock, Fingerprint, ServerCog, History,
  KeyRound, BookOpen, LifeBuoy, Newspaper, Monitor, Laptop, Puzzle, FileCheck2,
} from "lucide-react";
import { COLORS } from "./theme";

const PILLARS = [
  { num: "01", title: "ระบบเดียว", desc: "รวมแอปบัญชี กฎหมาย ภาษี และการเงินไว้ในแพลตฟอร์มเดียว ไม่ต้องสลับแอปไปมา", link: "apps" },
  { num: "02", title: "บัญชีเดียว", desc: "เข้าสู่ระบบครั้งเดียว ใช้ได้ทุกแอปในเครือ Obfice Base อย่างปลอดภัย", link: "security" },
  { num: "03", title: "ทีมเดียว", desc: "ทำงานร่วมกันข้ามแผนก แชร์ข้อมูลลูกค้าได้ตามสิทธิ์ที่กำหนดไว้", link: "pricing" },
];

const PRODUCTS_MENU = [
  { icon: Users, key: "apps", label: "แอปทั้งหมด", desc: "รวมแอปสำหรับบัญชี กฎหมาย ภาษี และการเงิน" },
  { icon: Calculator, key: "accounting", label: "AccounTrack", desc: "แอปบัญชีสำหรับสำนักงานและนักบัญชี" },
  { icon: Scale, key: "lexcase", label: "LexCase", desc: "แอปจัดการคดีความสำหรับสำนักงานกฎหมาย" },
  { icon: Landmark, key: "taxplan", label: "TaxPlan Pro", desc: "แอปวางแผนภาษีก่อนยื่นจริง" },
  { icon: LineChart, key: "fininsight", label: "FinInsight", desc: "แอปวิเคราะห์งบการเงินและกระแสเงินสด" },
  { icon: ShieldCheck, key: "security", label: "ความปลอดภัยของข้อมูล", desc: "มาตรฐานการเข้ารหัสและการป้องกันข้อมูล" },
  { icon: DownloadIcon, key: "download", label: "ดาวน์โหลดโปรแกรม", desc: "ใช้งานผ่าน Windows, macOS หรือส่วนขยายเบราว์เซอร์" },
];

const SOLUTIONS_MENU = [
  { icon: Calculator, key: "apps", label: "สำหรับนักบัญชี", desc: "บันทึกบัญชีและปิดงบอัตโนมัติ" },
  { icon: Scale, key: "apps", label: "สำหรับนักกฎหมาย", desc: "จัดการคดีและเอกสารลูกความ" },
  { icon: Landmark, key: "apps", label: "สำหรับนักวางแผนภาษี", desc: "จำลองแผนภาษีก่อนยื่นจริง" },
  { icon: LineChart, key: "apps", label: "สำหรับนักวิเคราะห์การเงิน", desc: "แดชบอร์ดวิเคราะห์งบการเงิน" },
];

const TRUST_ITEMS = [
  "สำนักงานบัญชี ศิริกุล", "ที่ปรึกษาภาษี แอคคิวเรท", "สำนักงานกฎหมาย ธรรมนิติ",
  "บริษัทวิเคราะห์การเงิน คลาริตี้", "สำนักงานบัญชี เมโทรโพลิแทน", "ที่ปรึกษาการเงิน เวลท์บริดจ์",
];

const APPS = [
  { icon: Calculator, name: "AccounTrack", tag: "บัญชี", desc: "บันทึกบัญชี กระทบยอด และปิดงบรายเดือนอัตโนมัติ พร้อมส่งออกรายงานภาษี" },
  { icon: Scale, name: "LexCase", tag: "กฎหมาย", desc: "จัดการคดีความ ติดตามนัดศาล และจัดเก็บเอกสารคดีแบบเข้ารหัสรายลูกความ" },
  { icon: Landmark, name: "TaxPlan Pro", tag: "วางแผนภาษี", desc: "จำลองสถานการณ์ภาษีหลายรูปแบบ เปรียบเทียบทางเลือกก่อนยื่นจริง" },
  { icon: LineChart, name: "FinInsight", tag: "วิเคราะห์การเงิน", desc: "แดชบอร์ดวิเคราะห์งบการเงินและกระแสเงินสดแบบเรียลไทม์" },
  { icon: FileSignature, name: "SignFlow", tag: "เอกสาร", desc: "ลงนามอิเล็กทรอนิกส์ที่มีผลทางกฎหมาย พร้อมประวัติการอนุมัติ" },
  { icon: FolderLock, name: "VaultDocs", tag: "จัดเก็บเอกสาร", desc: "คลังเอกสารกลางเข้ารหัสระดับองค์กร ค้นหาไฟล์ได้ในไม่กี่วินาที" },
  { icon: Receipt, name: "InvoiceHub", tag: "ออกใบแจ้งหนี้", desc: "สร้างและติดตามใบแจ้งหนี้ลูกค้า เชื่อมกับระบบบัญชีอัตโนมัติ" },
  { icon: MessageSquare, name: "ClientPortal", tag: "พอร์ทัลลูกค้า", desc: "ช่องทางสื่อสารและแชร์เอกสารกับลูกค้าอย่างปลอดภัยในที่เดียว" },
];

const APP_PAGE_MAP = {
  AccounTrack: { key: "accounting", color: COLORS.blue, soft: COLORS.blueSoft, soft2: COLORS.blueSoft2 },
  LexCase: { key: "lexcase", color: COLORS.orange, soft: COLORS.orangeSoft, soft2: COLORS.orangeSoft2 },
  "TaxPlan Pro": { key: "taxplan", color: COLORS.green, soft: COLORS.greenSoft, soft2: COLORS.greenSoft2 },
  FinInsight: { key: "fininsight", color: COLORS.purple, soft: COLORS.purpleSoft, soft2: COLORS.purpleSoft2 },
};

const LEXCASE_FEATURES = [
  { icon: Scale, title: "จัดการคดีความเป็นระบบ", desc: "รวมข้อมูลคดี คู่ความ และเอกสารทั้งหมดไว้ในหน้าเดียวต่อคดี ค้นหาย้อนหลังได้ทันที" },
  { icon: History, title: "ไทม์ไลน์คดีอัตโนมัติ", desc: "บันทึกความเคลื่อนไหวของคดีตามลำดับเวลา ตั้งแต่รับเรื่องจนถึงคำพิพากษา" },
  { icon: FolderLock, title: "แยกพื้นที่เอกสารรายลูกความ", desc: "เอกสารของลูกความแต่ละรายถูกเข้ารหัสและแยกจากกันโดยสมบูรณ์" },
  { icon: FileSignature, title: "ติดตามนัดศาลและกำหนดเวลา", desc: "แจ้งเตือนวันนัดพิจารณาคดีและกำหนดยื่นเอกสารล่วงหน้าอัตโนมัติ" },
  { icon: Users, title: "มอบหมายงานในทีมกฎหมาย", desc: "แบ่งงานให้ทนายความและผู้ช่วยตามคดี พร้อมติดตามความคืบหน้า" },
  { icon: Receipt, title: "บันทึกชั่วโมงทำงานต่อคดี", desc: "คิดค่าบริการตามชั่วโมงทำงานจริง และออกใบแจ้งหนี้แยกตามคดีได้ทันที" },
];

const PLANS = [
  { name: "บุคคลทั่วไป", price: "ฟรี", period: "", features: ["1 ผู้ใช้งาน", "จัดเก็บเอกสารสูงสุด 2GB", "แอปคำนวณภาษีเบื้องต้น", "รองรับผ่านอีเมล"] },
  { name: "ทีมงาน", price: "฿990", period: "/ผู้ใช้/เดือน", highlight: true, features: ["ผู้ใช้งานไม่จำกัด", "จัดเก็บเอกสาร 100GB ต่อทีม", "แอปครบทุกวิชาชีพ", "Audit trail และสิทธิ์ตามบทบาท", "รองรับผ่านแชทสด"] },
  { name: "องค์กร", price: "ติดต่อฝ่ายขาย", period: "", features: ["จัดเก็บข้อมูลไม่จำกัด", "เชื่อมต่อระบบภายในองค์กร (SSO)", "ผู้ดูแลระบบและ SLA เฉพาะราย", "ที่ปรึกษาความปลอดภัยส่วนตัว"] },
];

const SECURITY_ITEMS = [
  { icon: Lock, title: "เข้ารหัสแบบ AES-256", desc: "ข้อมูลทุกชิ้นเข้ารหัสขณะจัดเก็บ และ TLS 1.3 ขณะส่งผ่านเครือข่าย" },
  { icon: Fingerprint, title: "ยืนยันตัวตนหลายชั้น", desc: "รองรับ 2FA และการเข้าสู่ระบบผ่านอุปกรณ์ที่ได้รับอนุญาตเท่านั้น" },
  { icon: ServerCog, title: "แยกพื้นที่จัดเก็บรายสำนักงาน", desc: "ข้อมูลของแต่ละสำนักงานถูกแยกจากกันโดยสมบูรณ์ ไม่ปะปนกัน" },
  { icon: History, title: "บันทึกประวัติการเข้าถึงทั้งหมด", desc: "Audit log ทุกการเปิดอ่าน แก้ไข หรือดาวน์โหลดเอกสาร ย้อนหลังตรวจสอบได้" },
  { icon: ShieldCheck, title: "ตรวจสอบความปลอดภัยสม่ำเสมอ", desc: "ทดสอบเจาะระบบ (penetration test) และประเมินความเสี่ยงเป็นประจำทุกไตรมาส" },
  { icon: KeyRound, title: "จัดการกุญแจเข้ารหัสแยกจากข้อมูล", desc: "กุญแจเข้ารหัสถูกเก็บแยกจากตัวข้อมูล ลดความเสี่ยงหากมีการเข้าถึงโดยไม่ได้รับอนุญาต" },
];

const RESOURCE_CARDS = [
  { icon: BookOpen, title: "คู่มือเริ่มต้นใช้งาน", desc: "ขั้นตอนตั้งค่าทีมและนำเข้าข้อมูลครั้งแรกแบบละเอียด" },
  { icon: LifeBuoy, title: "ศูนย์ช่วยเหลือ", desc: "ค้นหาวิธีแก้ปัญหาที่พบบ่อย หรือติดต่อทีมสนับสนุน" },
  { icon: Newspaper, title: "บล็อกความรู้ภาษีและกฎหมาย", desc: "อัปเดตกฎระเบียบและเทคนิคการทำงานสำหรับสำนักงานวิชาชีพ" },
];

const FAQS = [
  { q: "ข้อมูลที่อัปโหลดถูกเข้ารหัสอย่างไร", a: "ทุกไฟล์ถูกเข้ารหัสด้วยมาตรฐาน AES-256 ก่อนจัดเก็บ และส่งผ่านการเชื่อมต่อ TLS 1.3 เสมอ กุญแจเข้ารหัสถูกแยกเก็บจากตัวข้อมูล" },
  { q: "สามารถยกเลิกสมาชิกได้ทุกเมื่อหรือไม่", a: "ได้ครับ สามารถยกเลิกหรือปรับเปลี่ยนแพ็กเกจได้ทุกเมื่อผ่านหน้าตั้งค่าบัญชี โดยไม่มีค่าปรับ" },
  { q: "เหมาะกับสำนักงานขนาดเล็กหรือไม่", a: "เหมาะมากครับ แพ็กเกจ 'ทีมงาน' คิดค่าบริการตามจำนวนผู้ใช้จริง จึงเริ่มต้นได้ตั้งแต่ทีม 2-3 คน" },
  { q: "ข้อมูลลูกค้าของแต่ละสำนักงานปะปนกันหรือไม่", a: "ไม่ปะปนกันครับ ระบบแยกพื้นที่จัดเก็บข้อมูลของแต่ละสำนักงานออกจากกันโดยสมบูรณ์" },
  { q: "มีโปรแกรมให้ดาวน์โหลดใช้งานแบบออฟไลน์หรือไม่", a: "มีครับ รองรับทั้งโปรแกรมสำหรับ Windows, macOS และส่วนขยายเบราว์เซอร์ Web Clipper สำหรับบันทึกหน้าเว็บเข้าคลังเอกสารโดยตรง" },
  { q: "หากลืมรหัสผ่านต้องทำอย่างไร", a: "สามารถรีเซ็ตรหัสผ่านผ่านอีเมลที่ลงทะเบียนไว้ หรือติดต่อฝ่ายสนับสนุนหากเปิดใช้การยืนยันตัวตนหลายชั้น" },
];

const DOWNLOADS = [
  { icon: Monitor, name: "Windows", version: "เวอร์ชัน 3.2.0", size: "148 MB", points: ["รองรับ Windows 10 ขึ้นไป", "ซิงก์อัตโนมัติกับคลังเอกสารบนคลาวด์", "แจ้งเตือนบนเดสก์ท็อป"] },
  { icon: Laptop, name: "macOS", version: "เวอร์ชัน 3.2.0", size: "162 MB", points: ["รองรับ macOS 12 ขึ้นไป", "รองรับชิป Apple Silicon และ Intel", "ซิงก์อัตโนมัติกับคลังเอกสารบนคลาวด์"] },
  { icon: Puzzle, name: "Web Clipper", version: "เวอร์ชัน 1.8.0", size: "ส่วนขยายเบราว์เซอร์", points: ["บันทึกหน้าเว็บและเอกสารออนไลน์เข้าคลังทันที", "รองรับ Chrome และ Edge", "เข้ารหัสข้อมูลก่อนอัปโหลดทุกครั้ง"] },
];

export {
  PILLARS, PRODUCTS_MENU, SOLUTIONS_MENU, TRUST_ITEMS, APPS, APP_PAGE_MAP,
  LEXCASE_FEATURES, PLANS, SECURITY_ITEMS, RESOURCE_CARDS, FAQS, DOWNLOADS,
};
