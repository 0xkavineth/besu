import { useEffect, useState } from "react";
import { COLORS } from "../../../theme";
import { Modal, Field, TextInput, Select, MultiSelectCreatable, CourtCombobox, TeamPickMultiSelect } from "./parts";
import AppointmentPicker from "./AppointmentPicker";
import { CASE_TYPES, PARTY_ROLES, CASE_STATUSES, CASE_OUTCOMES, t, tv, buddhistYear } from "./constants";
import { COURTS } from "./courts";
import { makeId } from "./useLexCaseStore";

const emptyCase = () => ({
  id: null,
  orderNo: "",
  blackNo: "", blackYear: "",
  redNo: "", redYear: "",
  court: "",
  caseType: "civil",
  partyRole: "plaintiff",
  plaintiffName: "", defendantName: "", petitionerName: "", respondentName: "",
  capitalAmount: "",
  chargeTags: [],
  ownerTags: [],
  appointments: [],
  status: "pending",
  outcome: "",
  filedDay: "", filedMonth: "", filedYear: "",
});

const currentBEYear = buddhistYear(new Date().getFullYear());
const YEAR_OPTIONS = Array.from({ length: 12 }, (_, i) => String(currentBEYear - i));
const DAY_OPTIONS = Array.from({ length: 31 }, (_, i) => String(i + 1));

export default function CaseFormModal({ open, onClose, onSave, initial, lang, charges, onCreateCharge, team, nextOrderNo }) {
  const [form, setForm] = useState(emptyCase());
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm(initial ? { ...emptyCase(), ...initial } : { ...emptyCase(), orderNo: nextOrderNo != null ? String(nextOrderNo) : "" });
      setError("");
    }
  }, [open, initial, nextOrderNo]);

  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const monthOptions = (lang === "en"
    ? ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    : ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"]
  ).map((label, i) => ({ value: String(i + 1), label }));

  const handleSave = () => {
    if (!form.blackNo.trim() || !form.court) {
      setError(t("required", lang));
      return;
    }
    onSave({ ...form, id: form.id || makeId("case") });
  };

  const courtOptions = COURTS.map((c) => ({ value: c.value, label: c.label }));
  const caseTypeOptions = CASE_TYPES.map((c) => ({ value: c.value, label: tv(c, lang) }));
  const partyOptions = PARTY_ROLES.map((c) => ({ value: c.value, label: tv(c, lang) }));
  const statusOptions = CASE_STATUSES.map((c) => ({ value: c.value, label: tv(c, lang) }));

  return (
    <Modal open={open} onClose={onClose} title={initial ? t("editCase", lang) : t("addCase", lang)} width={720}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Field label={t("orderNo", lang)} style={{ maxWidth: 160 }}>
          <TextInput
            type="number"
            min={1}
            value={form.orderNo}
            onChange={(e) => set({ orderNo: e.target.value })}
            placeholder="1"
          />
        </Field>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label={t("blackCaseNo", lang)}>
            <div style={{ display: "flex", gap: 8 }}>
              <TextInput value={form.blackNo} onChange={(e) => set({ blackNo: e.target.value })} placeholder="ผบ.1234" />
              <Select options={YEAR_OPTIONS.map((y) => ({ value: y, label: y }))} value={form.blackYear} onChange={(v) => set({ blackYear: v })} placeholder={t("year", lang)} style={{ width: 110 }} />
            </div>
          </Field>
          <Field label={t("redCaseNo", lang)}>
            <div style={{ display: "flex", gap: 8 }}>
              <TextInput value={form.redNo} onChange={(e) => set({ redNo: e.target.value })} placeholder="ผบ.1234" />
              <Select options={YEAR_OPTIONS.map((y) => ({ value: y, label: y }))} value={form.redYear} onChange={(v) => set({ redYear: v })} placeholder={t("year", lang)} style={{ width: 110 }} />
            </div>
          </Field>
        </div>

        <Field label={t("court", lang)}>
          <CourtCombobox options={courtOptions} value={form.court} onChange={(v) => set({ court: v })} lang={lang} />
        </Field>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label={t("caseType", lang)}>
            <Select options={caseTypeOptions} value={form.caseType} onChange={(v) => set({ caseType: v })} />
          </Field>
          <Field label={t("partyRole", lang)}>
            <Select options={partyOptions} value={form.partyRole} onChange={(v) => set({ partyRole: v })} />
          </Field>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label={t("plaintiffName", lang)}>
            <TextInput value={form.plaintiffName} onChange={(e) => set({ plaintiffName: e.target.value })} />
          </Field>
          <Field label={t("defendantName", lang)}>
            <TextInput value={form.defendantName} onChange={(e) => set({ defendantName: e.target.value })} />
          </Field>
          <Field label={t("petitionerName", lang)}>
            <TextInput value={form.petitionerName} onChange={(e) => set({ petitionerName: e.target.value })} />
          </Field>
          <Field label={t("respondentName", lang)}>
            <TextInput value={form.respondentName} onChange={(e) => set({ respondentName: e.target.value })} />
          </Field>
        </div>

        <Field label={t("charges", lang)}>
          <MultiSelectCreatable
            options={charges}
            values={form.chargeTags}
            onChange={(vals) => set({ chargeTags: vals })}
            onCreate={onCreateCharge}
            placeholder={t("addChargePlaceholder", lang)}
          />
        </Field>

        <Field label={t("caseOwner", lang)}>
          <TeamPickMultiSelect
            team={team}
            values={form.ownerTags}
            onChange={(vals) => set({ ownerTags: vals })}
            lang={lang}
          />
        </Field>

        <Field label={t("appointments", lang)}>
          <AppointmentPicker entries={form.appointments} onChange={(v) => set({ appointments: v })} lang={lang} />
        </Field>

        <Field label={t("capitalAmount", lang)} style={{ maxWidth: 260 }}>
          <TextInput
            type="number"
            min={0}
            step="0.01"
            value={form.capitalAmount}
            onChange={(e) => set({ capitalAmount: e.target.value })}
            placeholder="0.00"
          />
        </Field>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label={t("status", lang)}>
            <Select options={statusOptions} value={form.status} onChange={(v) => set({ status: v })} />
          </Field>
          <Field label={t("filedDate", lang)}>
            <div style={{ display: "flex", gap: 6 }}>
              <Select options={DAY_OPTIONS.map((d) => ({ value: d, label: d }))} value={form.filedDay} onChange={(v) => set({ filedDay: v })} placeholder={t("day", lang)} />
              <Select options={monthOptions} value={form.filedMonth} onChange={(v) => set({ filedMonth: v })} placeholder={t("month", lang)} />
              <Select options={YEAR_OPTIONS.map((y) => ({ value: y, label: y }))} value={form.filedYear} onChange={(v) => set({ filedYear: v })} placeholder={t("year", lang)} />
            </div>
          </Field>
        </div>

        <Field label={t("caseOutcome", lang)}>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {CASE_OUTCOMES.map((o) => {
              const active = form.outcome === o.value;
              return (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => set({ outcome: active ? "" : o.value })}
                  style={{
                    display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", borderRadius: 10,
                    border: `1.5px solid ${active ? o.color : COLORS.cardBorder}`,
                    background: active ? o.soft : "transparent", color: active ? o.color : COLORS.text,
                    fontWeight: active ? 700 : 500, fontSize: "0.85rem", cursor: "pointer",
                  }}
                >
                  <span style={{
                    width: 16, height: 16, borderRadius: 4, border: `1.5px solid ${active ? o.color : COLORS.cardBorder}`,
                    background: active ? o.color : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    {active && <span style={{ width: 7, height: 7, borderRadius: 2, background: "#fff" }} />}
                  </span>
                  {tv(o, lang)}
                </button>
              );
            })}
          </div>
        </Field>

        {error && <div style={{ color: "#ef4444", fontSize: "0.82rem" }}>{error}</div>}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 6 }}>
          <button onClick={onClose} style={{ background: COLORS.cardAlt, border: `1px solid ${COLORS.cardBorder}`, color: COLORS.text, borderRadius: 10, padding: "9px 20px", cursor: "pointer", fontWeight: 600 }}>
            {t("cancel", lang)}
          </button>
          <button onClick={handleSave} style={{ background: COLORS.orange, border: "none", color: "#fff", borderRadius: 10, padding: "9px 22px", cursor: "pointer", fontWeight: 700 }}>
            {t("save", lang)}
          </button>
        </div>
      </div>
    </Modal>
  );
}
