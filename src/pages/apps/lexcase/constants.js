// ---------------------------------------------
// Static option lists + bilingual (TH/EN) strings
// for the LexCase case-management app.
// ---------------------------------------------

export const CASE_TYPES = [
  { value: "civil", th: "คดีแพ่ง", en: "Civil" },
  { value: "criminal", th: "คดีอาญา", en: "Criminal" },
  { value: "admin", th: "คดีปกครอง", en: "Administrative" },
];

export const PARTY_ROLES = [
  { value: "plaintiff", th: "โจทก์", en: "Plaintiff" },
  { value: "defendant", th: "จำเลย", en: "Defendant" },
  { value: "petitioner", th: "ผู้ร้อง", en: "Petitioner" },
  { value: "respondent", th: "ผู้คัดค้าน", en: "Respondent" },
];

// Case status: value, TH/EN label, and the color used for status chips
// and the calendar/dashboard breakdown (per the brief's exact mapping).
export const CASE_STATUSES = [
  { value: "pending", th: "อยู่ระหว่างพิจารณา", en: "Under consideration", color: "#eab308", soft: "rgba(234,179,8,0.14)" },
  { value: "judged", th: "มีคำพิพากษาแล้ว", en: "Judgment issued", color: "#0ea5e9", soft: "rgba(14,165,233,0.14)" },
  { value: "appeal", th: "อุทธรณ์", en: "Appeal", color: "#f97316", soft: "rgba(249,115,22,0.14)" },
  { value: "supreme", th: "ฎีกา", en: "Supreme Court", color: "#ef4444", soft: "rgba(239,68,68,0.14)" },
  { value: "closed", th: "คดีเสร็จ", en: "Closed", color: "#22c55e", soft: "rgba(34,197,94,0.14)" },
  { value: "execution", th: "บังคับคดี", en: "Execution", color: "#ec4899", soft: "rgba(236,72,153,0.14)" },
];

export function statusMeta(value) {
  return CASE_STATUSES.find((s) => s.value === value) || CASE_STATUSES[0];
}

// Case outcome: ดี = win, ไม่ดี = lose. Ticked as one of two options
// once a case has a result (left unset while a case is still pending).
export const CASE_OUTCOMES = [
  { value: "win", th: "ดี (ชนะ)", en: "Good (Win)", color: "#22c55e", soft: "rgba(34,197,94,0.14)" },
  { value: "lose", th: "ไม่ดี (แพ้)", en: "Not good (Lose)", color: "#ef4444", soft: "rgba(239,68,68,0.14)" },
];

export function outcomeMeta(value) {
  return CASE_OUTCOMES.find((o) => o.value === value) || null;
}

export const DEFAULT_CHARGES = [
  "ผิดสัญญากู้ยืมเงิน", "ละเมิด", "เช่าซื้อ", "บัตรเครดิต", "แรงงาน",
  "ยักยอกทรัพย์", "ฉ้อโกง", "พ.ร.บ.ยาเสพติด", "ครอบครองที่ดิน", "หมิ่นประมาท",
];

export const THAI_MONTHS = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
];
export const THAI_MONTHS_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export function buddhistYear(y) {
  return y + 543;
}

// ---------------------------------------------
// Thai official government-office holidays (วันหยุดราชการ),
// keyed by ISO date "YYYY-MM-DD". Compiled from the Cabinet's
// published holiday schedule for each year. Only years fully
// verified against public announcements are included below —
// years outside this list simply won't show holiday markers.
// ---------------------------------------------
export const THAI_HOLIDAYS = {
  // 2568 / 2025
  "2025-01-01": { th: "วันขึ้นปีใหม่", en: "New Year's Day" },
  "2025-02-12": { th: "วันมาฆบูชา", en: "Makha Bucha Day" },
  "2025-04-06": { th: "วันจักรี", en: "Chakri Day" },
  "2025-04-07": { th: "วันหยุดชดเชยวันจักรี", en: "Chakri Day (substitute)" },
  "2025-04-13": { th: "วันสงกรานต์", en: "Songkran Festival" },
  "2025-04-14": { th: "วันสงกรานต์", en: "Songkran Festival" },
  "2025-04-15": { th: "วันสงกรานต์", en: "Songkran Festival" },
  "2025-04-16": { th: "วันหยุดชดเชยวันสงกรานต์", en: "Songkran (substitute)" },
  "2025-05-04": { th: "วันฉัตรมงคล", en: "Coronation Day" },
  "2025-05-05": { th: "วันหยุดชดเชยวันฉัตรมงคล", en: "Coronation Day (substitute)" },
  "2025-05-09": { th: "วันพืชมงคล", en: "Royal Ploughing Ceremony" },
  "2025-05-11": { th: "วันวิสาขบูชา", en: "Visakha Bucha Day" },
  "2025-05-12": { th: "วันหยุดชดเชยวันวิสาขบูชา", en: "Visakha Bucha (substitute)" },
  "2025-06-02": { th: "วันหยุดราชการกรณีพิเศษ", en: "Special government holiday" },
  "2025-06-03": { th: "วันเฉลิมพระชนมพรรษาสมเด็จพระราชินี", en: "Queen's Birthday" },
  "2025-07-10": { th: "วันอาสาฬหบูชา", en: "Asalha Puja Day" },
  "2025-07-11": { th: "วันเข้าพรรษา", en: "Buddhist Lent Day" },
  "2025-07-28": { th: "วันเฉลิมพระชนมพรรษาพระบาทสมเด็จพระเจ้าอยู่หัว", en: "King's Birthday" },
  "2025-08-11": { th: "วันหยุดราชการกรณีพิเศษ", en: "Special government holiday" },
  "2025-08-12": { th: "วันแม่แห่งชาติ", en: "Mother's Day" },
  "2025-10-13": { th: "วันคล้ายวันสวรรคต ร.9", en: "Anniversary of the Death of King Rama IX" },
  "2025-10-23": { th: "วันปิยมหาราช", en: "Chulalongkorn Day" },
  "2025-12-05": { th: "วันพ่อแห่งชาติ", en: "Father's Day" },
  "2025-12-10": { th: "วันรัฐธรรมนูญ", en: "Constitution Day" },
  "2025-12-31": { th: "วันสิ้นปี", en: "New Year's Eve" },

  // 2569 / 2026
  "2026-01-01": { th: "วันขึ้นปีใหม่", en: "New Year's Day" },
  "2026-01-02": { th: "วันหยุดราชการกรณีพิเศษ", en: "Special government holiday" },
  "2026-03-03": { th: "วันมาฆบูชา", en: "Makha Bucha Day" },
  "2026-04-06": { th: "วันจักรี", en: "Chakri Day" },
  "2026-04-13": { th: "วันสงกรานต์ (วันผู้สูงอายุ)", en: "Songkran Festival" },
  "2026-04-14": { th: "วันสงกรานต์ (วันครอบครัว)", en: "Songkran Festival" },
  "2026-04-15": { th: "วันสงกรานต์ (วันเถลิงศก)", en: "Songkran Festival" },
  "2026-05-04": { th: "วันฉัตรมงคล", en: "Coronation Day" },
  "2026-05-13": { th: "วันพืชมงคล", en: "Royal Ploughing Ceremony" },
  "2026-05-31": { th: "วันวิสาขบูชา", en: "Visakha Bucha Day" },
  "2026-06-01": { th: "วันหยุดชดเชยวันวิสาขบูชา", en: "Visakha Bucha (substitute)" },
  "2026-06-03": { th: "วันเฉลิมพระชนมพรรษาสมเด็จพระราชินี", en: "Queen's Birthday" },
  "2026-07-28": { th: "วันเฉลิมพระชนมพรรษาพระบาทสมเด็จพระเจ้าอยู่หัว", en: "King's Birthday" },
  "2026-07-29": { th: "วันอาสาฬหบูชา", en: "Asalha Puja Day" },
  "2026-07-30": { th: "วันเข้าพรรษา", en: "Buddhist Lent Day" },
  "2026-08-12": { th: "วันแม่แห่งชาติ", en: "Mother's Day" },
  "2026-10-13": { th: "วันคล้ายวันสวรรคต ร.9", en: "Anniversary of the Death of King Rama IX" },
  "2026-10-23": { th: "วันปิยมหาราช", en: "Chulalongkorn Day" },
  "2026-12-05": { th: "วันพ่อแห่งชาติ", en: "Father's Day" },
  "2026-12-07": { th: "วันหยุดชดเชยวันพ่อแห่งชาติ", en: "Father's Day (substitute)" },
  "2026-12-10": { th: "วันรัฐธรรมนูญ", en: "Constitution Day" },
  "2026-12-31": { th: "วันสิ้นปี", en: "New Year's Eve" },
};

export function holidayInfo(iso) {
  return THAI_HOLIDAYS[iso] || null;
}

// ---------------------------------------------
// i18n dictionary — flat key -> { th, en }
// ---------------------------------------------
export const STR = {
  appName: { th: "Lexcase", en: "Lexcase" },
  searchPlaceholder: { th: "ค้นหาชื่อโจทก์, จำเลย, เลขคดีดำ, เลขคดีแดง...", en: "Search plaintiff, defendant, black/red case no..." },
  nav_dashboard: { th: "หน้าหลัก", en: "Dashboard" },
  nav_cases: { th: "ข้อมูลคดี", en: "Cases" },
  nav_execution: { th: "บังคับคดี", en: "Execution" },
  nav_calendar: { th: "วันนัด/วันครบกำหนด", en: "Calendar" },
  nav_team: { th: "ข้อมูลสำนักงาน/ทีม", en: "Office / Team" },
  nav_summary: { th: "สรุป", en: "Summary" },
  backToSite: { th: "กลับหน้าเว็บหลัก", en: "Back to main site" },
  collapseSidebar: { th: "ย่อเมนู", en: "Collapse menu" },
  expandSidebar: { th: "ขยายเมนู", en: "Expand menu" },
  columns: { th: "คอลัมน์", en: "Columns" },
  showColumns: { th: "แสดงคอลัมน์", en: "Show columns" },
  resetColumns: { th: "แสดงทั้งหมด", en: "Show all" },
  colBlackNo: { th: "เลขคดีดำ", en: "Black no." },
  colRedNo: { th: "เลขคดีแดง", en: "Red no." },
  colCourt: { th: "ศาล", en: "Court" },
  colCaseType: { th: "ความ", en: "Type" },
  colPartyRole: { th: "ฝ่าย", en: "Party role" },
  colPartyName: { th: "คู่ความ", en: "Party" },
  colPlaintiff: { th: "โจทก์", en: "Plaintiff" },
  colDefendant: { th: "จำเลย", en: "Defendant" },
  colPetitioner: { th: "ผู้ร้อง", en: "Petitioner" },
  colRespondent: { th: "ผู้คัดค้าน", en: "Respondent" },
  colCharges: { th: "ข้อหา", en: "Charges" },
  colOwner: { th: "เจ้าของสำนวน", en: "Owner" },
  colStatus: { th: "สถานะ", en: "Status" },
  colFiledDate: { th: "วันที่รับฟ้อง", en: "Filed date" },
  colNextAppt: { th: "นัดถัดไป", en: "Next date" },
  colCapital: { th: "ทุนทรัพย์", en: "Capital amount" },
  colCreatedAt: { th: "สร้างเมื่อ", en: "Created" },
  colUpdatedAt: { th: "แก้ไขล่าสุด", en: "Updated" },
  colOrderNo: { th: "ลำดับ", en: "No." },
  colActions: { th: "จัดการ", en: "Actions" },
  rowsCount: { th: "รายการ", en: "rows" },
  orderNo: { th: "ลำดับ", en: "No." },
  capitalAmount: { th: "จำนวนทุนทรัพย์ (บาท)", en: "Capital amount (THB)" },
  createdAt: { th: "สร้างเมื่อ", en: "Created at" },
  updatedAt: { th: "แก้ไขล่าสุด", en: "Last updated" },
  exportExcel: { th: "ส่งออก Excel", en: "Export Excel" },
  importExcel: { th: "นำเข้า Excel", en: "Import Excel" },
  importSuccess: { th: "นำเข้าข้อมูลสำเร็จ", en: "Import complete" },
  importFail: { th: "ไม่สามารถอ่านไฟล์นี้ได้ กรุณาตรวจสอบรูปแบบไฟล์", en: "Couldn't read this file. Please check the format." },
  syncErrorBanner: {
    th: "เชื่อมต่อฐานข้อมูลไม่สำเร็จตอนนี้ — กำลังแสดงข้อมูลล่าสุดที่บันทึกไว้ในเครื่องนี้ การเปลี่ยนแปลงอาจไม่ถูกซิงก์ข้ามอุปกรณ์จนกว่าจะเชื่อมต่อได้อีกครั้ง",
    en: "Couldn't reach the database right now — showing the last data saved on this device. Changes may not sync across devices until the connection is restored.",
  },
  importedRows: { th: "แถวที่นำเข้า", en: "rows imported" },
  viewCase: { th: "ดูรายละเอียด", en: "View details" },
  caseDetails: { th: "รายละเอียดคดี", en: "Case details" },
  generalInfo: { th: "ข้อมูลทั่วไป", en: "General info" },
  partiesInfo: { th: "คู่ความ", en: "Parties" },
  metaInfo: { th: "ข้อมูลระบบ", en: "Record info" },
  close: { th: "ปิด", en: "Close" },
  noData: { th: "ไม่มีข้อมูล", en: "No data" },
  backToList: { th: "กลับไปหน้ารายการคดี", en: "Back to case list" },
  caseOutcome: { th: "ผลคดี", en: "Case outcome" },
  outcomeNone: { th: "ยังไม่มีผล", en: "No result yet" },
  courtSearchPlaceholder: { th: "พิมพ์เพื่อค้นหา/กรอกชื่อศาล...", en: "Type to search or enter a court name..." },
  courtNoMatch: { th: "ไม่พบศาลที่ตรงกัน — กด Enter เพื่อใช้ค่าที่พิมพ์", en: "No matching court — press Enter to use what you typed" },
  tabDocuments: { th: "เอกสารในสำนวน", en: "Case documents" },
  tabAppointments: { th: "ตารางวันนัด", en: "Appointment schedule" },
  uploadPdf: { th: "อัปโหลดไฟล์ PDF", en: "Upload PDF" },
  documentTitle: { th: "ชื่อเอกสาร", en: "Document title" },
  documentEffectiveDate: { th: "ฉบับวันที่", en: "Document date" },
  documentUploadedAt: { th: "วันที่อัปโหลด", en: "Uploaded on" },
  documentUploadedBy: { th: "ผู้อัปโหลด", en: "Uploaded by" },
  documentFile: { th: "ไฟล์ PDF", en: "PDF file" },
  noDocuments: { th: "ยังไม่มีเอกสารในสำนวนนี้", en: "No documents in this file yet" },
  addDocument: { th: "เพิ่มเอกสาร", en: "Add document" },
  pdfOnly: { th: "รองรับเฉพาะไฟล์ .pdf เท่านั้น", en: "Only .pdf files are supported" },
  selectUploader: { th: "เลือกผู้อัปโหลด (สมาชิกในทีม)", en: "Select uploader (team member)" },
  noTeamForUpload: { th: "ยังไม่มีสมาชิกในทีม กรุณาเพิ่มทีมก่อนอัปโหลดเอกสาร", en: "No team members yet — add your team before uploading documents" },
  apptSeq: { th: "ลำดับ", en: "No." },
  apptStatus: { th: "สถานะ", en: "Status" },
  apptPast: { th: "ผ่านไปแล้ว", en: "Past" },
  apptUpcoming: { th: "ยังไม่ถึง", en: "Upcoming" },
  noAppointmentsYet: { th: "ยังไม่มีวันนัดสำหรับคดีนี้", en: "No appointments recorded for this case yet" },
  viewDocument: { th: "เปิดดู", en: "View" },
  profile: { th: "โปรไฟล์", en: "Profile" },
  notifications: { th: "การแจ้งเตือน", en: "Notifications" },
  logout: { th: "ออกจากระบบ", en: "Log out" },
  comingSoon: { th: "จะเปิดให้ใช้งานเร็ว ๆ นี้", en: "Coming soon" },
  loadingSession: { th: "กำลังตรวจสอบสถานะการเข้าสู่ระบบ...", en: "Checking your session..." },

  // Dashboard
  totalCases: { th: "คดีทั้งหมด", en: "Total cases" },
  todaysAppointments: { th: "นัดวันนี้", en: "Today's appointments" },
  closedCases: { th: "คดีเสร็จแล้ว", en: "Closed cases" },
  executionCases: { th: "คดีบังคับคดี", en: "Execution cases" },
  statusBreakdown: { th: "สรุปตามสถานะคดี", en: "Status breakdown" },
  upcoming: { th: "นัดที่ใกล้ถึง", en: "Upcoming appointments" },
  noUpcoming: { th: "ไม่มีนัดที่ใกล้ถึง", en: "No upcoming appointments" },
  recentCases: { th: "คดีล่าสุด", en: "Recent cases" },

  // Case list / form
  addCase: { th: "เพิ่มคดีใหม่", en: "Add case" },
  editCase: { th: "แก้ไขคดี", en: "Edit case" },
  blackCaseNo: { th: "คดีหมายเลขดำที่", en: "Black case no." },
  redCaseNo: { th: "คดีหมายเลขแดงที่", en: "Red case no." },
  court: { th: "ศาล", en: "Court" },
  caseType: { th: "ความ", en: "Case type" },
  partyRole: { th: "ฝ่าย", en: "Party" },
  plaintiffName: { th: "ชื่อโจทก์", en: "Plaintiff name" },
  defendantName: { th: "ชื่อจำเลย", en: "Defendant name" },
  petitionerName: { th: "ชื่อผู้ร้อง", en: "Petitioner name" },
  respondentName: { th: "ชื่อผู้คัดค้าน", en: "Respondent name" },
  charges: { th: "ข้อหาหรือฐานความผิด", en: "Charges" },
  addChargePlaceholder: { th: "พิมพ์แล้วกด Enter เพื่อเพิ่มข้อหาใหม่", en: "Type and press Enter to add a new charge" },
  caseOwner: { th: "เจ้าของสำนวน", en: "Case owner" },
  appointments: { th: "วันนัด/วันครบกำหนด", en: "Appointments / due dates" },
  addAppointment: { th: "เพิ่มวันนัด", en: "Add date" },
  status: { th: "สถานะคดี", en: "Status" },
  filedDate: { th: "วันที่รับฟ้อง", en: "Filing date" },
  save: { th: "บันทึก", en: "Save" },
  cancel: { th: "ยกเลิก", en: "Cancel" },
  delete: { th: "ลบ", en: "Delete" },
  day: { th: "วัน", en: "Day" },
  month: { th: "เดือน", en: "Month" },
  year: { th: "ปี (พ.ศ.)", en: "Year (B.E.)" },
  noCases: { th: "ยังไม่มีข้อมูลคดี เริ่มเพิ่มคดีแรกของคุณ", en: "No cases yet — add your first case" },
  searchResultsFor: { th: "ผลการค้นหาสำหรับ", en: "Search results for" },
  clearSearch: { th: "ล้างการค้นหา", en: "Clear search" },
  required: { th: "กรุณากรอกข้อมูลนี้", en: "This field is required" },

  // Appointment modal
  apptName: { th: "ชื่อวัน/นัด", en: "Appointment name" },
  apptDate: { th: "วันที่", en: "Date" },
  apptTime: { th: "เวลา", en: "Time" },
  apptRemindDays: { th: "แจ้งเตือนล่วงหน้า (วัน)", en: "Remind before (days)" },
  apptRemindHours: { th: "แจ้งเตือนล่วงหน้า (ชั่วโมง)", en: "Remind before (hours)" },
  addAnotherDate: { th: "+ เพิ่มอีกวัน", en: "+ Add another date" },
  selectDate: { th: "เลือกวันที่", en: "Select date" },

  // Execution
  executionDesc: { th: "รายการคดีที่มีสถานะ \"บังคับคดี\" จะถูกดึงมาแสดงที่นี่โดยอัตโนมัติเมื่อปรับสถานะคดี", en: "Cases marked with status \"Execution\" sync here automatically." },
  executionLocked: { th: "การเพิ่มข้อมูลบังคับคดีเองยังไม่เปิดใช้งานในขณะนี้", en: "Manually adding execution records isn't available yet." },
  noExecution: { th: "ยังไม่มีคดีที่อยู่ในขั้นบังคับคดี", en: "No cases in execution yet" },

  // Calendar
  calendarTitle: { th: "ปฏิทินนัดความ", en: "Appointment calendar" },
  today: { th: "วันนี้", en: "Today" },
  eventsOn: { th: "นัดหมายวันที่", en: "Appointments on" },
  noEventsThisDay: { th: "ไม่มีนัดในวันนี้", en: "No appointments this day" },

  // Team
  addMember: { th: "เพิ่มสมาชิกทีม", en: "Add team member" },
  memberName: { th: "ชื่อ-นามสกุล", en: "Full name" },
  memberPosition: { th: "ตำแหน่ง", en: "Position" },
  memberPhotoUrl: { th: "ลิงก์รูปภาพ (ถ้ามี)", en: "Photo URL (optional)" },
  noTeam: { th: "ยังไม่มีสมาชิกในทีม", en: "No team members yet" },
  casesHandled: { th: "คดีที่รับผิดชอบ", en: "Cases handled" },

  // Owner picker (team-only)
  noTeamForOwner: { th: "ยังไม่มีข้อมูลทีม กรุณาเพิ่มสมาชิกในทีมก่อน จึงจะกำหนดเจ้าของสำนวนได้", en: "No team members yet — add a team member first before assigning a case owner" },
  pickOwnerFromTeam: { th: "เลือกจากรายชื่อในทีม", en: "Pick from your team" },
  noOwnerAssigned: { th: "ยังไม่ได้กำหนดเจ้าของสำนวน", en: "No owner assigned" },

  // Summary / bubble
  summaryTitle: { th: "สรุปภาพรวมคดีทั้งหมด", en: "Overview of all cases" },
  byStatus: { th: "แบ่งตามสถานะ", en: "By status" },
  byType: { th: "แบ่งตามประเภทคดี", en: "By case type" },
  byOwner: { th: "แบ่งตามเจ้าของสำนวน", en: "By case owner" },
  cases_unit: { th: "คดี", en: "cases" },

  // Calendar detail modal + holidays
  apptDetailsTitle: { th: "รายละเอียดวันนัด", en: "Appointment details" },
  holidayBadge: { th: "วันหยุดราชการ", en: "Government holiday" },
  remindSummary: { th: "แจ้งเตือนล่วงหน้า", en: "Reminder" },
  remindDaysUnit: { th: "วัน", en: "day(s)" },
  remindHoursUnit: { th: "ชั่วโมง", en: "hour(s)" },
  goToCase: { th: "ไปที่หน้าคดี", en: "Go to case" },
  monthGoTo: { th: "ไปเดือนนี้", en: "Jump to month" },
  fullCalendar: { th: "ดูปฏิทินแบบเต็ม", en: "View full calendar" },

  // Dashboard win-rate widget
  winRateTitle: { th: "อัตราชนะคดี (Win rate)", en: "Case win rate" },
  winRateDesc: { th: "คำนวณจากคดีที่ทราบผลแล้ว", en: "Calculated from cases with a known outcome" },
  winCountLabel: { th: "ชนะ", en: "Won" },
  loseCountLabel: { th: "แพ้", en: "Lost" },
  noOutcomeYetShort: { th: "ยังไม่มีคดีที่ทราบผล", en: "No decided cases yet" },
  miniCalendarTitle: { th: "ปฏิทินนัดความ", en: "Appointment calendar" },
};

export function t(key, lang) {
  const entry = STR[key];
  if (!entry) return key;
  return entry[lang] || entry.th;
}

export function tv(item, lang) {
  // For CASE_TYPES / PARTY_ROLES / CASE_STATUSES entries shaped { th, en }
  if (!item) return "";
  return item[lang] || item.th;
}
