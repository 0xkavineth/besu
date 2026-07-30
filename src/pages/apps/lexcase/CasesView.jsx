import { useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { Plus, Pencil, Trash2, Search, SlidersHorizontal, Check, RotateCcw, FileSpreadsheet, Upload } from "lucide-react";
import { COLORS } from "../../../theme";
import { StatusChip, IconButton, OwnerChip } from "./parts";
import CaseFormModal from "./CaseFormModal";
import CaseDetailPage from "./CaseDetailPage";
import { CASE_TYPES, CASE_STATUSES, outcomeMeta, tv, t } from "./constants";
import { COURTS } from "./courts";
import { makeId } from "./useLexCaseStore";

const courtLabel = (value) => COURTS.find((c) => c.value === value)?.label || value;
const dash = (v) => (v === undefined || v === null || v === "" ? "—" : v);

function partyRoleLabel(c, lang) {
  const map = {
    plaintiff: { th: "โจทก์", en: "Plaintiff" },
    defendant: { th: "จำเลย", en: "Defendant" },
    petitioner: { th: "ผู้ร้อง", en: "Petitioner" },
    respondent: { th: "ผู้คัดค้าน", en: "Respondent" },
  };
  const meta = map[c.partyRole];
  return meta ? (lang === "en" ? meta.en : meta.th) : "—";
}

function filedDateLabel(c) {
  if (!c.filedDay && !c.filedMonth && !c.filedYear) return "—";
  return [c.filedDay, c.filedMonth, c.filedYear].filter(Boolean).join("/");
}

function nextAppointment(c) {
  const list = (c.appointments || []).filter((a) => a.date).sort((a, b) => a.date.localeCompare(b.date));
  if (list.length === 0) return null;
  const today = new Date().toISOString().slice(0, 10);
  return list.find((a) => a.date >= today) || list[list.length - 1];
}

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

// ---------------------------------------------
// Column definitions for the Notion-style database
// table. `hideable: false` keeps a column pinned
// (always visible, not offered in the filter menu).
// ---------------------------------------------
function buildColumns(lang, team) {
  return [
    {
      key: "orderNo",
      label: t("colOrderNo", lang),
      hideable: false,
      width: 60,
      render: (c, idx) => <span style={{ fontSize: "0.82rem", fontWeight: 700, color: COLORS.textDim }}>{c.orderNo || idx + 1}</span>,
    },
    {
      key: "blackNo",
      label: t("colBlackNo", lang),
      hideable: false,
      width: 140,
      render: (c) => (
        <span style={{ fontWeight: 700, fontSize: "0.86rem" }}>
          {c.blackNo}{c.blackYear ? `/${c.blackYear}` : ""}
        </span>
      ),
    },
    {
      key: "redNo",
      label: t("colRedNo", lang),
      default: true,
      width: 130,
      render: (c) => (
        <span style={{ fontSize: "0.82rem" }}>
          {c.redNo ? `${c.redNo}${c.redYear ? `/${c.redYear}` : ""}` : "—"}
        </span>
      ),
    },
    {
      key: "court",
      label: t("colCourt", lang),
      default: true,
      width: 200,
      render: (c) => <span style={{ fontSize: "0.82rem" }}>{c.court ? courtLabel(c.court) : "—"}</span>,
    },
    {
      key: "caseType",
      label: t("colCaseType", lang),
      default: true,
      width: 110,
      render: (c) => {
        const meta = CASE_TYPES.find((x) => x.value === c.caseType);
        return <span style={{ fontSize: "0.82rem" }}>{meta ? tv(meta, lang) : "—"}</span>;
      },
    },
    {
      key: "partyRole",
      label: t("colPartyRole", lang),
      default: false,
      width: 110,
      render: (c) => <span style={{ fontSize: "0.82rem" }}>{partyRoleLabel(c, lang)}</span>,
    },
    {
      key: "plaintiffName",
      label: t("colPlaintiff", lang),
      default: true,
      width: 150,
      render: (c) => <span style={{ fontSize: "0.82rem" }}>{dash(c.plaintiffName)}</span>,
    },
    {
      key: "defendantName",
      label: t("colDefendant", lang),
      default: true,
      width: 150,
      render: (c) => <span style={{ fontSize: "0.82rem" }}>{dash(c.defendantName)}</span>,
    },
    {
      key: "petitionerName",
      label: t("colPetitioner", lang),
      default: true,
      width: 150,
      render: (c) => <span style={{ fontSize: "0.82rem" }}>{dash(c.petitionerName)}</span>,
    },
    {
      key: "respondentName",
      label: t("colRespondent", lang),
      default: true,
      width: 150,
      render: (c) => <span style={{ fontSize: "0.82rem" }}>{dash(c.respondentName)}</span>,
    },
    {
      key: "capitalAmount",
      label: t("colCapital", lang),
      default: true,
      width: 140,
      render: (c) => <span style={{ fontSize: "0.82rem" }}>{formatCapital(c.capitalAmount)}</span>,
    },
    {
      key: "charges",
      label: t("colCharges", lang),
      default: false,
      width: 220,
      render: (c) => (
        c.chargeTags?.length > 0 ? (
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {c.chargeTags.map((tag) => (
              <span key={tag} style={{ fontSize: "0.68rem", background: COLORS.cardAlt, borderRadius: 999, padding: "2px 8px", color: COLORS.textDim, whiteSpace: "nowrap" }}>{tag}</span>
            ))}
          </div>
        ) : <span style={{ fontSize: "0.82rem", color: COLORS.textDim }}>—</span>
      ),
    },
    {
      key: "owner",
      label: t("colOwner", lang),
      default: false,
      width: 160,
      render: (c) => (
        c.ownerTags?.length ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {c.ownerTags.map((name) => (
              <OwnerChip key={name} name={name} photo={team.find((m) => m.name === name)?.photo} small />
            ))}
          </div>
        ) : <span style={{ fontSize: "0.82rem", color: COLORS.textDim }}>—</span>
      ),
    },
    {
      key: "status",
      label: t("colStatus", lang),
      default: true,
      width: 170,
      render: (c) => <StatusChip value={c.status} lang={lang} small />,
    },
    {
      key: "outcome",
      label: t("caseOutcome", lang),
      default: false,
      width: 120,
      render: (c) => {
        const meta = outcomeMeta(c.outcome);
        if (!meta) return <span style={{ fontSize: "0.82rem", color: COLORS.textDim }}>—</span>;
        return (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "3px 9px", borderRadius: 999, fontSize: "0.72rem", fontWeight: 700, background: meta.soft, color: meta.color }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: meta.color }} />
            {tv(meta, lang)}
          </span>
        );
      },
    },
    {
      key: "filedDate",
      label: t("colFiledDate", lang),
      default: true,
      width: 130,
      render: (c) => <span style={{ fontSize: "0.82rem" }}>{filedDateLabel(c)}</span>,
    },
    {
      key: "nextAppt",
      label: t("colNextAppt", lang),
      default: true,
      width: 150,
      render: (c) => {
        const appt = nextAppointment(c);
        if (!appt) return <span style={{ fontSize: "0.82rem", color: COLORS.textDim }}>—</span>;
        return (
          <div>
            <div style={{ fontSize: "0.82rem", fontWeight: 600 }}>{appt.date}</div>
            {appt.name && <div style={{ fontSize: "0.72rem", color: COLORS.textDim }}>{appt.name}</div>}
          </div>
        );
      },
    },
    {
      key: "createdAt",
      label: t("colCreatedAt", lang),
      default: false,
      width: 160,
      render: (c) => <span style={{ fontSize: "0.78rem", color: COLORS.textDim }}>{formatDateTime(c.createdAt, lang)}</span>,
    },
    {
      key: "updatedAt",
      label: t("colUpdatedAt", lang),
      default: false,
      width: 160,
      render: (c) => <span style={{ fontSize: "0.78rem", color: COLORS.textDim }}>{formatDateTime(c.updatedAt, lang)}</span>,
    },
  ];
}

const COLUMN_PREFS_KEY = "lexcase_cases_visible_columns";

function loadPrefs(defaults) {
  try {
    const raw = localStorage.getItem(COLUMN_PREFS_KEY);
    if (raw) return { ...defaults, ...JSON.parse(raw) };
  } catch {
    // ignore
  }
  return defaults;
}

export default function CasesView({ store, lang, searchQuery }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [detailCase, setDetailCase] = useState(null);
  const [colMenuOpen, setColMenuOpen] = useState(false);
  const colMenuRef = useRef(null);

  const columns = useMemo(() => buildColumns(lang, store.team), [lang, store.team]);

  const defaultVisibility = useMemo(() => {
    const map = {};
    columns.forEach((col) => { if (col.hideable !== false) map[col.key] = !!col.default; });
    return map;
  }, [columns]);

  const [visible, setVisible] = useState(() => loadPrefs(defaultVisibility));

  useEffect(() => {
    setVisible((v) => ({ ...defaultVisibility, ...v }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try { localStorage.setItem(COLUMN_PREFS_KEY, JSON.stringify(visible)); } catch { /* ignore */ }
  }, [visible]);

  useEffect(() => {
    function onDocClick(e) {
      if (colMenuRef.current && !colMenuRef.current.contains(e.target)) setColMenuOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    if (!detailCase) return;
    const latest = store.cases.find((c) => c.id === detailCase.id);
    if (latest && latest !== detailCase) setDetailCase(latest);
    if (!latest) setDetailCase(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store.cases]);

  const visibleColumns = columns.filter((col) => col.hideable === false || visible[col.key]);
  const toggleCount = columns.filter((col) => col.hideable !== false).length;
  const visibleCount = columns.filter((col) => col.hideable !== false && visible[col.key]).length;

  const filtered = useMemo(() => {
    const q = (searchQuery || "").trim().toLowerCase();
    if (!q) return store.cases;
    return store.cases.filter((c) => {
      const hay = [
        c.blackNo, c.redNo, c.plaintiffName, c.defendantName, c.petitionerName, c.respondentName,
      ].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [store.cases, searchQuery]);

  const nextOrderNo = store.cases.length + 1;

  const openAdd = () => { setEditing(null); setModalOpen(true); };
  const openEdit = (c) => { setDetailCase(null); setEditing(c); setModalOpen(true); };
  const handleSave = (record) => { store.upsertCase(record); setModalOpen(false); };
  const handleDelete = (id) => { store.deleteCase(id); setDetailCase(null); };

  const toggleColumn = (key) => setVisible((v) => ({ ...v, [key]: !v[key] }));
  const showAllColumns = () => {
    const all = {};
    columns.forEach((col) => { if (col.hideable !== false) all[col.key] = true; });
    setVisible(all);
  };

  const exportExcel = () => {
    const rows = filtered.map((c, idx) => ({
      [t("colOrderNo", lang)]: c.orderNo || idx + 1,
      [t("colBlackNo", lang)]: `${c.blackNo || ""}${c.blackYear ? `/${c.blackYear}` : ""}`,
      [t("colRedNo", lang)]: c.redNo ? `${c.redNo}${c.redYear ? `/${c.redYear}` : ""}` : "—",
      [t("colCourt", lang)]: c.court ? courtLabel(c.court) : "—",
      [t("colCaseType", lang)]: (CASE_TYPES.find((x) => x.value === c.caseType) && tv(CASE_TYPES.find((x) => x.value === c.caseType), lang)) || "—",
      [t("colPlaintiff", lang)]: dash(c.plaintiffName),
      [t("colDefendant", lang)]: dash(c.defendantName),
      [t("colPetitioner", lang)]: dash(c.petitionerName),
      [t("colRespondent", lang)]: dash(c.respondentName),
      [t("colCapital", lang)]: formatCapital(c.capitalAmount),
      [t("colCharges", lang)]: c.chargeTags?.length ? c.chargeTags.join(", ") : "—",
      [t("colOwner", lang)]: c.ownerTags?.length ? c.ownerTags.join(", ") : "—",
      [t("colStatus", lang)]: c.status,
      [t("colFiledDate", lang)]: filedDateLabel(c),
      [t("colNextAppt", lang)]: nextAppointment(c)?.date || "—",
      [t("colCreatedAt", lang)]: formatDateTime(c.createdAt, lang),
      [t("colUpdatedAt", lang)]: formatDateTime(c.updatedAt, lang),
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Cases");
    const filename = `lexcase-${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, filename);
  };

  // ---------------------------------------------
  // Import Excel: reads the first sheet and reverse-maps
  // the same column headers exportExcel writes (in either
  // Thai or English, whichever the workbook has) back into
  // case records. Rows matching an existing black case no.
  // update that case; everything else becomes a new case.
  // ---------------------------------------------
  const importInputRef = useRef(null);
  const [importMsg, setImportMsg] = useState("");

  const cell = (row, colKey) => {
    const th = t(colKey, "th");
    const en = t(colKey, "en");
    if (row[th] !== undefined && row[th] !== "") return row[th];
    if (row[en] !== undefined && row[en] !== "") return row[en];
    return "";
  };

  const clean = (v) => {
    const s = String(v ?? "").trim();
    return s === "—" ? "" : s;
  };

  const splitNoYear = (v) => {
    const s = clean(v);
    if (!s) return { no: "", year: "" };
    const [no, year = ""] = s.split("/");
    return { no: no.trim(), year: year.trim() };
  };

  const reverseCourt = (label) => {
    const s = clean(label);
    if (!s) return "";
    const match = COURTS.find((c) => c.label === s);
    return match ? match.value : s; // free text allowed, matches CourtCombobox behaviour
  };

  const reverseByTv = (list, label) => {
    const s = clean(label);
    if (!s) return "";
    const match = list.find((x) => x.th === s || x.en === s);
    return match ? match.value : "";
  };

  const triggerImport = () => importInputRef.current?.click();

  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportMsg("");
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws, { defval: "" });

      let count = 0;
      rows.forEach((row) => {
        const black = splitNoYear(cell(row, "colBlackNo"));
        if (!black.no) return; // black case no. is required, skip empty/garbage rows

        const red = splitNoYear(cell(row, "colRedNo"));
        const existing = store.cases.find((c) => c.blackNo === black.no && String(c.blackYear || "") === String(black.year || ""));

        const statusRaw = clean(cell(row, "colStatus"));
        const statusValue = CASE_STATUSES.find((s) => s.value === statusRaw) ? statusRaw : (existing?.status || "pending");

        const capitalRaw = clean(cell(row, "colCapital")).replace(/,/g, "");
        const capitalAmount = capitalRaw && !Number.isNaN(Number(capitalRaw)) ? capitalRaw : "";

        const chargesRaw = clean(cell(row, "colCharges"));
        const ownerRaw = clean(cell(row, "colOwner"));

        const record = {
          id: existing?.id || makeId("case"),
          orderNo: clean(cell(row, "colOrderNo")) || existing?.orderNo || "",
          blackNo: black.no,
          blackYear: black.year,
          redNo: red.no,
          redYear: red.year,
          court: reverseCourt(cell(row, "colCourt")) || existing?.court || "",
          caseType: reverseByTv(CASE_TYPES, cell(row, "colCaseType")) || existing?.caseType || "civil",
          partyRole: existing?.partyRole || "plaintiff",
          plaintiffName: clean(cell(row, "colPlaintiff")),
          defendantName: clean(cell(row, "colDefendant")),
          petitionerName: clean(cell(row, "colPetitioner")),
          respondentName: clean(cell(row, "colRespondent")),
          capitalAmount,
          chargeTags: chargesRaw ? chargesRaw.split(",").map((s) => s.trim()).filter(Boolean) : (existing?.chargeTags || []),
          // Case owners must already exist in the team roster — names
          // in the import file that don't match a team member are dropped.
          ownerTags: ownerRaw
            ? ownerRaw.split(",").map((s) => s.trim()).filter((name) => name && store.team.some((m) => m.name === name))
            : (existing?.ownerTags || []),
          appointments: existing?.appointments || [],
          documents: existing?.documents || [],
          status: statusValue,
          outcome: existing?.outcome || "",
          filedDay: existing?.filedDay || "", filedMonth: existing?.filedMonth || "", filedYear: existing?.filedYear || "",
          createdAt: existing?.createdAt,
        };
        store.upsertCase(record);
        count += 1;
      });

      setImportMsg(`${t("importSuccess", lang)} (${count} ${t("importedRows", lang)})`);
    } catch (err) {
      setImportMsg(t("importFail", lang));
    } finally {
      if (importInputRef.current) importInputRef.current.value = "";
      setTimeout(() => setImportMsg(""), 5000);
    }
  };

  if (detailCase) {
    return (
      <>
        <CaseDetailPage
          record={detailCase}
          lang={lang}
          store={store}
          onBack={() => setDetailCase(null)}
          onEdit={openEdit}
          onDelete={handleDelete}
        />
        <CaseFormModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
          initial={editing}
          lang={lang}
          charges={store.charges}
          onCreateCharge={store.addCharge}
          team={store.team}
          nextOrderNo={nextOrderNo}
        />
      </>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.3rem", fontWeight: 700 }}>{t("nav_cases", lang)}</div>
          {searchQuery ? (
            <div style={{ fontSize: "0.8rem", color: COLORS.textDim, marginTop: 4, display: "flex", alignItems: "center", gap: 6 }}>
              <Search size={12} /> {t("searchResultsFor", lang)}: "{searchQuery}" ({filtered.length})
            </div>
          ) : (
            <div style={{ fontSize: "0.8rem", color: COLORS.textDim, marginTop: 4 }}>
              {filtered.length} {t("rowsCount", lang)}
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <input ref={importInputRef} type="file" accept=".xlsx,.xls,.csv" onChange={handleImportFile} style={{ display: "none" }} />
          <button
            onClick={triggerImport}
            style={{
              display: "flex", alignItems: "center", gap: 7, background: COLORS.cardAlt, color: COLORS.text,
              border: `1px solid ${COLORS.cardBorder}`, borderRadius: 10, padding: "9px 14px", fontWeight: 600,
              fontSize: "0.82rem", cursor: "pointer",
            }}
          >
            <Upload size={14} /> {t("importExcel", lang)}
          </button>

          <button
            onClick={exportExcel}
            disabled={filtered.length === 0}
            style={{
              display: "flex", alignItems: "center", gap: 7, background: COLORS.cardAlt, color: COLORS.text,
              border: `1px solid ${COLORS.cardBorder}`, borderRadius: 10, padding: "9px 14px", fontWeight: 600,
              fontSize: "0.82rem", cursor: filtered.length === 0 ? "not-allowed" : "pointer", opacity: filtered.length === 0 ? 0.5 : 1,
            }}
          >
            <FileSpreadsheet size={14} /> {t("exportExcel", lang)}
          </button>

          <div style={{ position: "relative" }} ref={colMenuRef}>
            <button
              onClick={() => setColMenuOpen((v) => !v)}
              style={{
                display: "flex", alignItems: "center", gap: 7, background: colMenuOpen ? COLORS.orangeSoft : COLORS.cardAlt,
                color: colMenuOpen ? COLORS.orangeDark : COLORS.text, border: `1px solid ${colMenuOpen ? COLORS.orangeSoft2 : COLORS.cardBorder}`,
                borderRadius: 10, padding: "9px 14px", fontWeight: 600, fontSize: "0.82rem", cursor: "pointer",
              }}
            >
              <SlidersHorizontal size={14} /> {t("columns", lang)} ({visibleCount}/{toggleCount})
            </button>
            {colMenuOpen && (
              <div style={{
                position: "absolute", right: 0, top: 44, width: 240, background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`,
                borderRadius: 12, boxShadow: "0 20px 40px -16px rgba(20,18,30,0.2)", padding: 10, zIndex: 25,
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "2px 6px 8px", borderBottom: `1px solid ${COLORS.cardBorder}`, marginBottom: 6 }}>
                  <span style={{ fontSize: "0.76rem", fontWeight: 700, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: "0.03em" }}>{t("showColumns", lang)}</span>
                  <button
                    onClick={showAllColumns}
                    style={{ display: "flex", alignItems: "center", gap: 4, background: "none", border: "none", color: COLORS.orangeDark, fontSize: "0.72rem", fontWeight: 700, cursor: "pointer", padding: 2 }}
                  >
                    <RotateCcw size={11} /> {t("resetColumns", lang)}
                  </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 1, maxHeight: 320, overflowY: "auto" }}>
                  {columns.filter((col) => col.hideable !== false).map((col) => {
                    const isOn = !!visible[col.key];
                    return (
                      <button
                        key={col.key}
                        onClick={() => toggleColumn(col.key)}
                        style={{
                          display: "flex", alignItems: "center", gap: 9, padding: "7px 8px", borderRadius: 8, border: "none",
                          background: "transparent", cursor: "pointer", width: "100%", textAlign: "left",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.cardAlt)}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <span style={{
                          width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${isOn ? COLORS.orange : COLORS.cardBorder}`,
                          background: isOn ? COLORS.orange : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                        }}>
                          {isOn && <Check size={11} color="#fff" strokeWidth={3} />}
                        </span>
                        <span style={{ fontSize: "0.82rem", color: COLORS.text }}>{col.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={openAdd}
            style={{ display: "flex", alignItems: "center", gap: 8, background: COLORS.orange, color: "#fff", border: "none", borderRadius: 10, padding: "10px 18px", fontWeight: 700, cursor: "pointer" }}
          >
            <Plus size={16} /> {t("addCase", lang)}
          </button>
        </div>
      </div>

      {importMsg && (
        <div style={{ marginBottom: 14, fontSize: "0.82rem", fontWeight: 600, color: COLORS.orangeDark, background: COLORS.orangeSoft, borderRadius: 10, padding: "9px 14px" }}>
          {importMsg}
        </div>
      )}

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: COLORS.textDim, border: `1px dashed ${COLORS.cardBorder}`, borderRadius: 16 }}>
          {t("noCases", lang)}
        </div>
      ) : (
        <div style={{ border: `1px solid ${COLORS.cardBorder}`, borderRadius: 14, overflow: "hidden", background: COLORS.card }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
              <thead>
                <tr>
                  {visibleColumns.map((col) => (
                    <th
                      key={col.key}
                      style={{
                        position: "sticky", top: 0, textAlign: "left", padding: "10px 14px", fontSize: "0.72rem",
                        fontWeight: 700, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: "0.03em",
                        background: COLORS.cardAlt, borderBottom: `1px solid ${COLORS.cardBorder}`,
                        minWidth: col.width, whiteSpace: "nowrap", zIndex: 2,
                      }}
                    >
                      {col.label}
                    </th>
                  ))}
                  <th style={{
                    position: "sticky", top: 0, textAlign: "right", padding: "10px 14px", fontSize: "0.72rem",
                    fontWeight: 700, color: COLORS.textDim, textTransform: "uppercase", letterSpacing: "0.03em",
                    background: COLORS.cardAlt, borderBottom: `1px solid ${COLORS.cardBorder}`, minWidth: 90, zIndex: 2,
                  }}>
                    {t("colActions", lang)}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, idx) => (
                  <tr
                    key={c.id}
                    onClick={() => setDetailCase(c)}
                    style={{ borderBottom: idx === filtered.length - 1 ? "none" : `1px solid ${COLORS.cardBorder}`, cursor: "pointer" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.cardAlt)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    {visibleColumns.map((col) => (
                      <td key={col.key} style={{ padding: "12px 14px", verticalAlign: "top" }}>
                        {col.render(c, idx)}
                      </td>
                    ))}
                    <td style={{ padding: "10px 14px", verticalAlign: "top", textAlign: "right" }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                        <IconButton icon={Pencil} onClick={() => openEdit(c)} title={t("editCase", lang)} />
                        <IconButton icon={Trash2} danger onClick={() => store.deleteCase(c.id)} title={t("delete", lang)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <CaseFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        initial={editing}
        lang={lang}
        charges={store.charges}
        onCreateCharge={store.addCharge}
        team={store.team}
        nextOrderNo={nextOrderNo}
      />
    </div>
  );
}
