import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { COLORS } from "../../../theme";
import { THAI_MONTHS, THAI_MONTHS_EN, buddhistYear, holidayInfo, t } from "./constants";
import { Avatar, OwnerChip, Modal } from "./parts";

function pad(n) { return String(n).padStart(2, "0"); }
function isoDate(y, m, d) { return `${y}-${pad(m + 1)}-${pad(d)}`; }
function todayISO() {
  const d = new Date();
  return isoDate(d.getFullYear(), d.getMonth(), d.getDate());
}

function buildEventsByDate(cases) {
  const map = {};
  cases.forEach((c) => {
    (c.appointments || []).forEach((a) => {
      if (!map[a.date]) map[a.date] = [];
      map[a.date].push({ ...a, caseRef: c });
    });
  });
  return map;
}

function ownerPhoto(team, name) {
  return team.find((m) => m.name === name)?.photo;
}

// ---------------------------------------------
// Shared month grid — used both by the full CalendarView
// and the compact dashboard widget below.
// ---------------------------------------------
function MonthGrid({ viewDate, setViewDate, eventsByDate, lang, selectedDay, onSelectDay, compact }) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const first = new Date(year, month, 1);
  const startDow = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const months = lang === "en" ? THAI_MONTHS_EN : THAI_MONTHS;
  const yearLabel = lang === "en" ? year : buddhistYear(year);
  const dow = lang === "en" ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] : ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const today = todayISO();

  return (
    <div style={{ background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 16, padding: compact ? 14 : 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <button onClick={() => setViewDate(new Date(year, month - 1, 1))} style={{ background: COLORS.cardAlt, border: "none", borderRadius: 8, padding: 8, cursor: "pointer", display: "flex" }}>
          <ChevronLeft size={16} />
        </button>
        <div style={{ fontWeight: 700, fontSize: compact ? "0.86rem" : "1rem" }}>{months[month]} {yearLabel}</div>
        <button onClick={() => setViewDate(new Date(year, month + 1, 1))} style={{ background: COLORS.cardAlt, border: "none", borderRadius: 8, padding: 8, cursor: "pointer", display: "flex" }}>
          <ChevronRight size={16} />
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, marginBottom: 6 }}>
        {dow.map((d, i) => <div key={i} style={{ textAlign: "center", fontSize: "0.68rem", color: COLORS.textDim, fontWeight: 700 }}>{d}</div>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const iso = isoDate(year, month, d);
          const evts = eventsByDate[iso] || [];
          const holiday = holidayInfo(iso);
          const isToday = iso === today;
          const isSelected = iso === selectedDay;
          return (
            <button
              key={i}
              onClick={() => onSelectDay(iso)}
              title={holiday ? (lang === "en" ? holiday.en : holiday.th) : undefined}
              style={{
                aspectRatio: "1", borderRadius: 10, cursor: "pointer", padding: 4, display: "flex",
                flexDirection: "column", alignItems: "center", justifyContent: "flex-start", gap: 3,
                border: isToday ? `1.5px solid ${COLORS.orange}` : `1px solid ${isSelected ? COLORS.orange : "transparent"}`,
                background: isSelected ? COLORS.orangeSoft : (holiday ? "rgba(239,68,68,0.08)" : "transparent"),
              }}
            >
              <span style={{ fontSize: compact ? "0.72rem" : "0.78rem", fontWeight: isToday ? 700 : 500, color: holiday ? "#ef4444" : COLORS.text }}>{d}</span>
              {evts.length > 0 && (
                <span style={{ display: "flex", gap: 2 }}>
                  {evts.slice(0, 3).map((_, idx) => (
                    <span key={idx} style={{ width: 4, height: 4, borderRadius: "50%", background: COLORS.orange }} />
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Modal shown when an appointment is clicked — full details plus
// the case owner(s)' profile photos.
function ApptDetailModal({ evt, lang, team, onClose }) {
  if (!evt) return null;
  const c = evt.caseRef;
  return (
    <Modal open={!!evt} onClose={onClose} title={t("apptDetailsTitle", lang)} width={480}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <div style={{ fontSize: "1.05rem", fontWeight: 700 }}>{evt.name || t("apptName", lang)}</div>
          <div style={{ fontSize: "0.82rem", color: COLORS.orangeDark, fontWeight: 700, marginTop: 4 }}>{evt.date} · {evt.time}</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, fontSize: "0.82rem" }}>
          <div>
            <div style={{ color: COLORS.textDim, fontSize: "0.72rem", marginBottom: 2 }}>{t("blackCaseNo", lang)}</div>
            <div style={{ fontWeight: 600 }}>{c.blackNo}{c.blackYear ? `/${c.blackYear}` : ""}</div>
          </div>
          <div>
            <div style={{ color: COLORS.textDim, fontSize: "0.72rem", marginBottom: 2 }}>{t("court", lang)}</div>
            <div style={{ fontWeight: 600 }}>{c.court || "—"}</div>
          </div>
        </div>

        {(evt.remindDays || evt.remindHours) && (
          <div style={{ fontSize: "0.8rem", color: COLORS.textDim }}>
            {t("remindSummary", lang)}: {evt.remindDays ? `${evt.remindDays} ${t("remindDaysUnit", lang)}` : ""} {evt.remindHours ? `${evt.remindHours} ${t("remindHoursUnit", lang)}` : ""}
          </div>
        )}

        <div>
          <div style={{ color: COLORS.textDim, fontSize: "0.72rem", marginBottom: 6 }}>{t("caseOwner", lang)}</div>
          {c.ownerTags?.length ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {c.ownerTags.map((name) => (
                <OwnerChip key={name} name={name} photo={ownerPhoto(team, name)} />
              ))}
            </div>
          ) : (
            <div style={{ fontSize: "0.8rem", color: COLORS.textDim }}>{t("noOwnerAssigned", lang)}</div>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default function CalendarView({ store, lang }) {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(todayISO());
  const [activeEvt, setActiveEvt] = useState(null);

  const eventsByDate = useMemo(() => buildEventsByDate(store.cases), [store.cases]);

  const selectedEvents = eventsByDate[selectedDay] || [];
  const selectedHoliday = holidayInfo(selectedDay);

  return (
    <div>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.3rem", fontWeight: 700, marginBottom: 18 }}>
        {t("calendarTitle", lang)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18, alignItems: "start" }}>
        <MonthGrid
          viewDate={viewDate}
          setViewDate={setViewDate}
          eventsByDate={eventsByDate}
          lang={lang}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
        />

        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 16, padding: 20 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>{t("eventsOn", lang)} {selectedDay}</div>
          {selectedHoliday && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.74rem", fontWeight: 700, color: "#ef4444", background: "rgba(239,68,68,0.1)", borderRadius: 999, padding: "3px 10px", marginBottom: 12 }}>
              {t("holidayBadge", lang)}: {lang === "en" ? selectedHoliday.en : selectedHoliday.th}
            </div>
          )}
          {selectedEvents.length === 0 ? (
            <div style={{ fontSize: "0.82rem", color: COLORS.textDim }}>{t("noEventsThisDay", lang)}</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {selectedEvents.map((e) => (
                <button
                  key={e.id}
                  onClick={() => setActiveEvt(e)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, borderBottom: `1px solid ${COLORS.cardBorder}`, paddingBottom: 8,
                    background: "none", border: "none", borderBottomWidth: 1, textAlign: "left", cursor: "pointer", width: "100%", padding: "2px 2px 8px",
                  }}
                >
                  <Avatar name={e.caseRef.ownerTags?.[0]} photo={ownerPhoto(store.team, e.caseRef.ownerTags?.[0])} size={30} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.85rem", fontWeight: 700 }}>{e.name || t("apptName", lang)}</div>
                    <div style={{ fontSize: "0.75rem", color: COLORS.textDim, marginTop: 2 }}>
                      {t("blackCaseNo", lang)} {e.caseRef.blackNo} · {e.time}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <ApptDetailModal evt={activeEvt} lang={lang} team={store.team} onClose={() => setActiveEvt(null)} />
    </div>
  );
}

// ---------------------------------------------
// Compact calendar widget for the dashboard ("หน้าหลัก") —
// same month grid, plus a short list of the closest upcoming
// appointments with owner avatars.
// ---------------------------------------------
export function MiniCalendarWidget({ store, lang, onOpenFull }) {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(todayISO());
  const [activeEvt, setActiveEvt] = useState(null);

  const eventsByDate = useMemo(() => buildEventsByDate(store.cases), [store.cases]);
  const selectedEvents = eventsByDate[selectedDay] || [];
  const selectedHoliday = holidayInfo(selectedDay);

  return (
    <div style={{ background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 16, padding: 18 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ fontWeight: 700 }}>{t("miniCalendarTitle", lang)}</div>
        {onOpenFull && (
          <button onClick={onOpenFull} style={{ background: "none", border: "none", color: COLORS.orangeDark, fontSize: "0.76rem", fontWeight: 700, cursor: "pointer" }}>
            {t("fullCalendar", lang)}
          </button>
        )}
      </div>
      <MonthGrid
        viewDate={viewDate}
        setViewDate={setViewDate}
        eventsByDate={eventsByDate}
        lang={lang}
        selectedDay={selectedDay}
        onSelectDay={setSelectedDay}
        compact
      />
      <div style={{ marginTop: 12 }}>
        {selectedHoliday && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.7rem", fontWeight: 700, color: "#ef4444", background: "rgba(239,68,68,0.1)", borderRadius: 999, padding: "3px 9px", marginBottom: 8 }}>
            {t("holidayBadge", lang)}: {lang === "en" ? selectedHoliday.en : selectedHoliday.th}
          </div>
        )}
        {selectedEvents.length === 0 ? (
          <div style={{ fontSize: "0.78rem", color: COLORS.textDim }}>{t("noEventsThisDay", lang)}</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {selectedEvents.slice(0, 4).map((e) => (
              <button
                key={e.id}
                onClick={() => setActiveEvt(e)}
                style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0 }}
              >
                <Avatar name={e.caseRef.ownerTags?.[0]} photo={ownerPhoto(store.team, e.caseRef.ownerTags?.[0])} size={24} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: "0.78rem", fontWeight: 700 }}>{e.name || t("apptName", lang)}</div>
                  <div style={{ fontSize: "0.7rem", color: COLORS.textDim }}>{e.time}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      <ApptDetailModal evt={activeEvt} lang={lang} team={store.team} onClose={() => setActiveEvt(null)} />
    </div>
  );
}
