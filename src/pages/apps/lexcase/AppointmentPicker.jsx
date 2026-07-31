import { useState } from "react";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Trash2, Plus } from "lucide-react";
import { COLORS } from "../../../theme";
import { Modal, TextInput, Field } from "./parts";
import { THAI_MONTHS, THAI_MONTHS_EN, buddhistYear, t } from "./constants";
import { makeId } from "./useLexCaseStore";

function pad(n) { return String(n).padStart(2, "0"); }
function isoDate(y, m, d) { return `${y}-${pad(m + 1)}-${pad(d)}`; }

function MiniCalendar({ viewDate, setViewDate, selectedDates, onPickDate, lang }) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const first = new Date(year, month, 1);
  const startDow = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const months = lang === "en" ? THAI_MONTHS_EN : THAI_MONTHS;
  const yearLabel = lang === "en" ? year : buddhistYear(year);

  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const dow = lang === "en" ? ["S", "M", "T", "W", "T", "F", "S"] : ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <button onClick={() => setViewDate(new Date(year, month - 1, 1))} style={{ background: COLORS.cardAlt, border: "none", borderRadius: 8, padding: 6, cursor: "pointer", display: "flex" }}>
          <ChevronLeft size={16} />
        </button>
        <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{months[month]} {yearLabel}</div>
        <button onClick={() => setViewDate(new Date(year, month + 1, 1))} style={{ background: COLORS.cardAlt, border: "none", borderRadius: 8, padding: 6, cursor: "pointer", display: "flex" }}>
          <ChevronRight size={16} />
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 4 }}>
        {dow.map((d, i) => (
          <div key={i} style={{ textAlign: "center", fontSize: "0.7rem", color: COLORS.textDim, fontWeight: 600 }}>{d}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const iso = isoDate(year, month, d);
          const picked = selectedDates.includes(iso);
          return (
            <button
              key={i}
              onClick={() => onPickDate(iso)}
              style={{
                aspectRatio: "1", border: "none", borderRadius: 8, cursor: "pointer", fontSize: "0.8rem",
                background: picked ? COLORS.orange : "transparent", color: picked ? "#fff" : COLORS.text,
                fontWeight: picked ? 700 : 500,
              }}
              onMouseEnter={(e) => { if (!picked) e.currentTarget.style.background = COLORS.orangeSoft; }}
              onMouseLeave={(e) => { if (!picked) e.currentTarget.style.background = "transparent"; }}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// entries: [{ id, date: "YYYY-MM-DD", name, time, remindDays, remindHours }]
export default function AppointmentPicker({ entries, onChange, lang }) {
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());

  const selectedDates = entries.map((e) => e.date);

  const pickDate = (iso) => {
    const exists = entries.find((e) => e.date === iso);
    if (exists) {
      onChange(entries.filter((e) => e.date !== iso));
    } else {
      onChange([...entries, { id: makeId("appt"), date: iso, name: "", time: "09:00", remindDays: 1, remindHours: 0 }]);
    }
  };

  const updateEntry = (id, patch) => {
    onChange(entries.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  };

  const removeEntry = (id) => {
    onChange(entries.filter((e) => e.id !== id));
  };

  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          display: "flex", alignItems: "center", gap: 8, background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`,
          borderRadius: 10, padding: "9px 12px", cursor: "pointer", color: COLORS.text, fontSize: "0.85rem", width: "100%",
        }}
      >
        <CalendarIcon size={16} color={COLORS.orange} />
        {entries.length > 0
          ? `${entries.length} ${lang === "en" ? "date(s) selected" : "วันที่เลือกไว้"}`
          : t("selectDate", lang)}
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title={t("appointments", lang)} width={520}>
        <MiniCalendar viewDate={viewDate} setViewDate={setViewDate} selectedDates={selectedDates} onPickDate={pickDate} lang={lang} />

        {sorted.length > 0 && (
          <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 14 }}>
            {sorted.map((e) => (
              <div key={e.id} style={{ border: `1px solid ${COLORS.cardBorder}`, borderRadius: 12, padding: 12, display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontWeight: 700, fontSize: "0.85rem", color: COLORS.orangeDark }}>{e.date}</div>
                  <button onClick={() => removeEntry(e.id)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", color: "#ef4444" }}>
                    <Trash2 size={14} />
                  </button>
                </div>
                <Field label={t("apptName", lang)}>
                  <TextInput value={e.name} onChange={(ev) => updateEntry(e.id, { name: ev.target.value })} placeholder={lang === "en" ? "e.g. Hearing" : "เช่น นัดสืบพยาน"} />
                </Field>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  <Field label={t("apptTime", lang)}>
                    <TextInput type="time" value={e.time} onChange={(ev) => updateEntry(e.id, { time: ev.target.value })} />
                  </Field>
                  <Field label={t("apptRemindDays", lang)}>
                    <TextInput type="number" min={0} value={e.remindDays} onChange={(ev) => updateEntry(e.id, { remindDays: Number(ev.target.value) })} />
                  </Field>
                  <Field label={t("apptRemindHours", lang)}>
                    <TextInput type="number" min={0} value={e.remindHours} onChange={(ev) => updateEntry(e.id, { remindHours: Number(ev.target.value) })} />
                  </Field>
                </div>
              </div>
            ))}
          </div>
        )}
        <div style={{ marginTop: 16, textAlign: "right" }}>
          <button onClick={() => setOpen(false)} style={{ background: COLORS.orange, color: "#fff", border: "none", borderRadius: 10, padding: "9px 18px", fontWeight: 700, cursor: "pointer" }}>
            {t("save", lang)}
          </button>
        </div>
      </Modal>
    </>
  );
}
