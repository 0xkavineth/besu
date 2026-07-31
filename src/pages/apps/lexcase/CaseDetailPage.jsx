import { useRef, useState } from "react";
import { ArrowLeft, Pencil, Trash2, Upload, FileText, Download, Trash } from "lucide-react";
import { COLORS } from "../../../theme";
import { Field, TextInput, Select, StatusChip, OwnerChip } from "./parts";
import { CASE_TYPES, PARTY_ROLES, CASE_OUTCOMES, outcomeMeta, t, tv } from "./constants";
import { COURTS } from "./courts";
import { makeId } from "./useLexCaseStore";

const courtLabel = (value) => COURTS.find((c) => c.value === value)?.label || value;

function formatDateTime(iso, lang) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = lang === "en" ? d.getFullYear() : d.getFullYear() + 543;
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hh}:${mm}`;
}

function formatCapital(v) {
  if (v === undefined || v === null || v === "") return "—";
  const num = Number(v);
  if (Number.isNaN(num)) return "—";
  return num.toLocaleString("th-TH", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

function filedDateLabel(c) {
  if (!c.filedDay && !c.filedMonth && !c.filedYear) return "—";
  return [c.filedDay, c.filedMonth, c.filedYear].filter(Boolean).join("/");
}

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function DetailField({ label, children }) {
  return (
    <div>
      <div style={{ fontSize: "0.72rem", fontWeight: 700, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: "0.03em", marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: "0.88rem", color: COLORS.text, wordBreak: "break-word" }}>{children}</div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <div style={{ fontSize: "0.78rem", fontWeight: 700, color: COLORS.orangeDark, marginBottom: 10, marginTop: 4 }}>
      {children}
    </div>
  );
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

// ---------------------------------------------
// "เอกสารในสำนวน" tab — upload PDFs, name them,
// tag with an effective date, and record who (from
// the team roster) uploaded them and when.
// ---------------------------------------------
function DocumentsTab({ record, lang, store }) {
  const [title, setTitle] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [uploadedBy, setUploadedBy] = useState(store.team[0]?.name || "");
  const [pendingFile, setPendingFile] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const docs = (record.documents || []).slice().sort((a, b) => (b.uploadedAt || "").localeCompare(a.uploadedAt || ""));

  const onPickFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError(t("pdfOnly", lang));
      setPendingFile(null);
      return;
    }
    setError("");
    setPendingFile(file);
    if (!title) setTitle(file.name.replace(/\.pdf$/i, ""));
  };

  const handleAdd = async () => {
    if (!pendingFile) { setError(t("pdfOnly", lang)); return; }
    if (!title.trim()) { setError(t("required", lang)); return; }
    if (!uploadedBy) { setError(t("required", lang)); return; }
    const fileData = await fileToBase64(pendingFile);
    store.addCaseDocument(record.id, {
      id: makeId("doc"),
      title: title.trim(),
      effectiveDate,
      fileName: pendingFile.name,
      fileData,
      uploadedAt: new Date().toISOString(),
      uploadedBy,
    });
    setTitle("");
    setEffectiveDate("");
    setPendingFile(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const openDoc = (doc) => {
    const w = window.open();
    if (w) {
      w.document.write(`<iframe src="${doc.fileData}" style="border:0;width:100%;height:100vh;"></iframe>`);
      w.document.title = doc.title;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ background: COLORS.cardAlt, border: `1px dashed ${COLORS.cardBorder}`, borderRadius: 14, padding: 16 }}>
        <SectionTitle>{t("addDocument", lang)}</SectionTitle>
        {store.team.length === 0 ? (
          <div style={{ fontSize: "0.82rem", color: COLORS.textDim }}>{t("noTeamForUpload", lang)}</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label={t("documentTitle", lang)}>
                <TextInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder={lang === "en" ? "e.g. Complaint" : "เช่น คำฟ้อง"} />
              </Field>
              <Field label={t("documentEffectiveDate", lang)}>
                <TextInput type="date" value={effectiveDate} onChange={(e) => setEffectiveDate(e.target.value)} />
              </Field>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label={t("documentFile", lang)}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={onPickFile}
                  style={{ fontSize: "0.82rem", color: COLORS.text }}
                />
              </Field>
              <Field label={t("selectUploader", lang)}>
                <Select
                  options={store.team.map((m) => ({ value: m.name, label: m.name }))}
                  value={uploadedBy}
                  onChange={setUploadedBy}
                  placeholder="—"
                />
              </Field>
            </div>
            {error && <div style={{ color: "#ef4444", fontSize: "0.8rem" }}>{error}</div>}
            <div>
              <button
                onClick={handleAdd}
                style={{ display: "flex", alignItems: "center", gap: 8, background: COLORS.orange, color: "#fff", border: "none", borderRadius: 10, padding: "9px 18px", fontWeight: 700, cursor: "pointer" }}
              >
                <Upload size={15} /> {t("uploadPdf", lang)}
              </button>
            </div>
          </div>
        )}
      </div>

      {docs.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px", color: COLORS.textDim, border: `1px dashed ${COLORS.cardBorder}`, borderRadius: 14 }}>
          {t("noDocuments", lang)}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {docs.map((doc) => (
            <div key={doc.id} style={{ display: "flex", alignItems: "center", gap: 12, background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 12, padding: "12px 14px" }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: COLORS.orangeSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <FileText size={17} color={COLORS.orangeDark} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: "0.86rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.title}</div>
                <div style={{ fontSize: "0.74rem", color: COLORS.textDim, marginTop: 2, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {doc.effectiveDate && <span>{t("documentEffectiveDate", lang)}: {doc.effectiveDate}</span>}
                  <span>{t("documentUploadedAt", lang)}: {formatDateTime(doc.uploadedAt, lang)}</span>
                  <span>{t("documentUploadedBy", lang)}: {doc.uploadedBy}</span>
                </div>
              </div>
              <button onClick={() => openDoc(doc)} title={t("viewDocument", lang)} style={{ background: COLORS.cardAlt, border: "none", borderRadius: 8, padding: 8, cursor: "pointer", display: "flex", color: COLORS.text }}>
                <Download size={15} />
              </button>
              <button onClick={() => store.deleteCaseDocument(record.id, doc.id)} title={t("delete", lang)} style={{ background: "rgba(239,68,68,0.1)", border: "none", borderRadius: 8, padding: 8, cursor: "pointer", display: "flex", color: "#ef4444" }}>
                <Trash size={15} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------
// "ตารางวันนัด" tab — every appointment/due date
// recorded on the case, flagged past vs upcoming.
// ---------------------------------------------
function AppointmentsTab({ record, lang }) {
  const today = todayISO();
  const rows = (record.appointments || []).slice().sort((a, b) => (a.date || "").localeCompare(b.date || ""));

  if (rows.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px 20px", color: COLORS.textDim, border: `1px dashed ${COLORS.cardBorder}`, borderRadius: 14 }}>
        {t("noAppointmentsYet", lang)}
      </div>
    );
  }

  return (
    <div style={{ border: `1px solid ${COLORS.cardBorder}`, borderRadius: 14, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {[t("apptSeq", lang), t("apptName", lang), t("apptDate", lang), t("apptTime", lang), t("apptStatus", lang)].map((h) => (
              <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: "0.72rem", fontWeight: 700, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: "0.03em", background: COLORS.cardAlt, borderBottom: `1px solid ${COLORS.cardBorder}` }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((a, idx) => {
            const past = a.date && a.date < today;
            return (
              <tr key={a.id} style={{ borderBottom: idx === rows.length - 1 ? "none" : `1px solid ${COLORS.cardBorder}` }}>
                <td style={{ padding: "10px 14px", fontSize: "0.82rem", color: COLORS.textDim }}>{idx + 1}</td>
                <td style={{ padding: "10px 14px", fontSize: "0.84rem", fontWeight: 600 }}>{a.name || "—"}</td>
                <td style={{ padding: "10px 14px", fontSize: "0.82rem" }}>{a.date || "—"}</td>
                <td style={{ padding: "10px 14px", fontSize: "0.82rem" }}>{a.time || "—"}</td>
                <td style={{ padding: "10px 14px" }}>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 10px", borderRadius: 999,
                    fontSize: "0.72rem", fontWeight: 700,
                    background: past ? "rgba(107,114,128,0.14)" : COLORS.orangeSoft,
                    color: past ? "#6b7280" : COLORS.orangeDark,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: past ? "#6b7280" : COLORS.orange }} />
                    {past ? t("apptPast", lang) : t("apptUpcoming", lang)}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function CaseDetailPage({ record, lang, store, onBack, onEdit, onDelete }) {
  const [tab, setTab] = useState("documents");
  if (!record) return null;

  const typeMeta = CASE_TYPES.find((x) => x.value === record.caseType);
  const roleMeta = PARTY_ROLES.find((x) => x.value === record.partyRole);
  const outMeta = outcomeMeta(record.outcome);

  const TABS = [
    { key: "documents", label: t("tabDocuments", lang) },
    { key: "appointments", label: t("tabAppointments", lang) },
  ];

  return (
    <div>
      <button
        onClick={onBack}
        style={{ display: "flex", alignItems: "center", gap: 8, background: COLORS.cardAlt, border: `1px solid ${COLORS.cardBorder}`, color: COLORS.text, borderRadius: 10, padding: "8px 16px", fontWeight: 600, fontSize: "0.84rem", cursor: "pointer", marginBottom: 18 }}
      >
        <ArrowLeft size={15} /> {t("backToList", lang)}
      </button>

      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 18, padding: 24 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 22 }}>
          <div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.3rem", fontWeight: 700 }}>
              {t("blackCaseNo", lang)} {record.blackNo}{record.blackYear ? `/${record.blackYear}` : ""}
            </div>
            {record.redNo && (
              <div style={{ fontSize: "0.85rem", color: COLORS.textDim, marginTop: 3 }}>
                {t("redCaseNo", lang)} {record.redNo}{record.redYear ? `/${record.redYear}` : ""}
              </div>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <StatusChip value={record.status} lang={lang} />
            {outMeta && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 999, fontSize: "0.78rem", fontWeight: 700, background: outMeta.soft, color: outMeta.color }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: outMeta.color }} />
                {tv(outMeta, lang)}
              </span>
            )}
            <button onClick={() => onDelete(record.id)} style={{ display: "flex", alignItems: "center", gap: 7, background: "rgba(239,68,68,0.1)", border: "none", color: "#ef4444", borderRadius: 10, padding: "9px 16px", cursor: "pointer", fontWeight: 700 }}>
              <Trash2 size={15} /> {t("delete", lang)}
            </button>
            <button onClick={() => onEdit(record)} style={{ display: "flex", alignItems: "center", gap: 7, background: COLORS.orange, border: "none", color: "#fff", borderRadius: 10, padding: "9px 18px", cursor: "pointer", fontWeight: 700 }}>
              <Pencil size={15} /> {t("editCase", lang)}
            </button>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div>
            <SectionTitle>{t("generalInfo", lang)}</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              <DetailField label={t("orderNo", lang)}>{record.orderNo || "—"}</DetailField>
              <DetailField label={t("court", lang)}>{record.court ? courtLabel(record.court) : "—"}</DetailField>
              <DetailField label={t("caseType", lang)}>{typeMeta ? tv(typeMeta, lang) : "—"}</DetailField>
              <DetailField label={t("partyRole", lang)}>{roleMeta ? tv(roleMeta, lang) : "—"}</DetailField>
              <DetailField label={t("capitalAmount", lang)}>{formatCapital(record.capitalAmount)}</DetailField>
              <DetailField label={t("filedDate", lang)}>{filedDateLabel(record)}</DetailField>
            </div>
          </div>

          <div>
            <SectionTitle>{t("partiesInfo", lang)}</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
              <DetailField label={t("plaintiffName", lang)}>{record.plaintiffName || "—"}</DetailField>
              <DetailField label={t("defendantName", lang)}>{record.defendantName || "—"}</DetailField>
              <DetailField label={t("petitionerName", lang)}>{record.petitionerName || "—"}</DetailField>
              <DetailField label={t("respondentName", lang)}>{record.respondentName || "—"}</DetailField>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <DetailField label={t("charges", lang)}>
              {record.chargeTags?.length > 0 ? (
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 2 }}>
                  {record.chargeTags.map((tag) => (
                    <span key={tag} style={{ fontSize: "0.74rem", background: COLORS.cardAlt, borderRadius: 999, padding: "3px 10px", color: COLORS.textDim }}>{tag}</span>
                  ))}
                </div>
              ) : "—"}
            </DetailField>
            <DetailField label={t("caseOwner", lang)}>
              {record.ownerTags?.length ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {record.ownerTags.map((name) => (
                    <OwnerChip key={name} name={name} photo={store.team.find((m) => m.name === name)?.photo} />
                  ))}
                </div>
              ) : "—"}
            </DetailField>
          </div>

          <div style={{ borderTop: `1px solid ${COLORS.cardBorder}`, paddingTop: 14 }}>
            <SectionTitle>{t("metaInfo", lang)}</SectionTitle>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <DetailField label={t("createdAt", lang)}>{formatDateTime(record.createdAt, lang)}</DetailField>
              <DetailField label={t("updatedAt", lang)}>{formatDateTime(record.updatedAt, lang)}</DetailField>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 22 }}>
        <div style={{ display: "flex", gap: 6, borderBottom: `1px solid ${COLORS.cardBorder}`, marginBottom: 18 }}>
          {TABS.map((tb) => {
            const active = tab === tb.key;
            return (
              <button
                key={tb.key}
                onClick={() => setTab(tb.key)}
                style={{
                  padding: "10px 16px", border: "none", background: "transparent", cursor: "pointer",
                  fontSize: "0.86rem", fontWeight: active ? 700 : 500, color: active ? COLORS.orangeDark : COLORS.textDim,
                  borderBottom: active ? `2.5px solid ${COLORS.orange}` : "2.5px solid transparent", marginBottom: -1,
                }}
              >
                {tb.label}
              </button>
            );
          })}
        </div>
        {tab === "documents" ? (
          <DocumentsTab record={record} lang={lang} store={store} />
        ) : (
          <AppointmentsTab record={record} lang={lang} />
        )}
      </div>
    </div>
  );
}
