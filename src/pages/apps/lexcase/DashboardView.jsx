import { useMemo } from "react";
import { Briefcase, CalendarClock, CheckCircle2, Gavel, Scale } from "lucide-react";
import { COLORS } from "../../../theme";
import { StatusChip } from "./parts";
import { CASE_STATUSES, tv, t } from "./constants";
import { MiniCalendarWidget } from "./CalendarView";

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function StatCard({ icon: Icon, label, value, color, soft }) {
  return (
    <div style={{ background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 16, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: soft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon size={20} color={color} />
      </div>
      <div>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.6rem", fontWeight: 700 }}>{value}</div>
        <div style={{ fontSize: "0.78rem", color: COLORS.textDim }}>{label}</div>
      </div>
    </div>
  );
}

function WinRateWidget({ store, lang }) {
  const winCount = store.cases.filter((c) => c.outcome === "win").length;
  const loseCount = store.cases.filter((c) => c.outcome === "lose").length;
  const decided = winCount + loseCount;
  const rate = decided > 0 ? Math.round((winCount / decided) * 100) : 0;

  return (
    <div style={{ background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 16, padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <Scale size={16} color={COLORS.orange} />
        <div style={{ fontWeight: 700 }}>{t("winRateTitle", lang)}</div>
      </div>
      <div style={{ fontSize: "0.76rem", color: COLORS.textDim, marginBottom: 14 }}>{t("winRateDesc", lang)}</div>

      {decided === 0 ? (
        <div style={{ fontSize: "0.82rem", color: COLORS.textDim }}>{t("noOutcomeYetShort", lang)}</div>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 10 }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "2rem", fontWeight: 700, color: "#22c55e" }}>{rate}%</div>
          </div>
          <div style={{ background: COLORS.cardAlt, borderRadius: 999, height: 10, overflow: "hidden", display: "flex", marginBottom: 12 }}>
            <div style={{ width: `${rate}%`, background: "#22c55e", height: "100%" }} />
            <div style={{ width: `${100 - rate}%`, background: "#ef4444", height: "100%" }} />
          </div>
          <div style={{ display: "flex", gap: 18, fontSize: "0.78rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e" }} />
              {t("winCountLabel", lang)}: <strong>{winCount}</strong>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444" }} />
              {t("loseCountLabel", lang)}: <strong>{loseCount}</strong>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function DashboardView({ store, lang, onOpenCalendar }) {
  const today = todayISO();

  const todaysAppts = useMemo(() => {
    const list = [];
    store.cases.forEach((c) => {
      (c.appointments || []).forEach((a) => {
        if (a.date === today) list.push({ ...a, caseRef: c });
      });
    });
    return list;
  }, [store.cases, today]);

  const upcomingAppts = useMemo(() => {
    const list = [];
    store.cases.forEach((c) => {
      (c.appointments || []).forEach((a) => {
        if (a.date >= today) list.push({ ...a, caseRef: c });
      });
    });
    return list.sort((a, b) => a.date.localeCompare(b.date)).slice(0, 6);
  }, [store.cases, today]);

  const closedCount = store.cases.filter((c) => c.status === "closed").length;
  const executionCount = store.cases.filter((c) => c.status === "execution").length;

  const statusCounts = CASE_STATUSES.map((s) => ({
    ...s,
    count: store.cases.filter((c) => c.status === s.value).length,
  }));
  const maxCount = Math.max(1, ...statusCounts.map((s) => s.count));

  return (
    <div>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.3rem", fontWeight: 700, marginBottom: 18 }}>
        {t("nav_dashboard", lang)}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 24 }}>
        <StatCard icon={Briefcase} label={t("totalCases", lang)} value={store.cases.length} color={COLORS.orange} soft={COLORS.orangeSoft} />
        <StatCard icon={CalendarClock} label={t("todaysAppointments", lang)} value={todaysAppts.length} color="#0ea5e9" soft="rgba(14,165,233,0.12)" />
        <StatCard icon={CheckCircle2} label={t("closedCases", lang)} value={closedCount} color="#22c55e" soft="rgba(34,197,94,0.12)" />
        <StatCard icon={Gavel} label={t("executionCases", lang)} value={executionCount} color="#ec4899" soft="rgba(236,72,153,0.12)" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 18 }}>
        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 16, padding: 20 }}>
          <div style={{ fontWeight: 700, marginBottom: 14 }}>{t("statusBreakdown", lang)}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {statusCounts.map((s) => (
              <div key={s.value} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 130, fontSize: "0.78rem", color: COLORS.textDim }}>{tv(s, lang)}</div>
                <div style={{ flex: 1, background: COLORS.cardAlt, borderRadius: 999, height: 8, overflow: "hidden" }}>
                  <div style={{ width: `${(s.count / maxCount) * 100}%`, background: s.color, height: "100%", borderRadius: 999 }} />
                </div>
                <div style={{ width: 24, textAlign: "right", fontSize: "0.8rem", fontWeight: 700 }}>{s.count}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 16, padding: 20 }}>
          <div style={{ fontWeight: 700, marginBottom: 14 }}>{t("upcoming", lang)}</div>
          {upcomingAppts.length === 0 ? (
            <div style={{ fontSize: "0.82rem", color: COLORS.textDim }}>{t("noUpcoming", lang)}</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {upcomingAppts.map((a) => (
                <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, borderBottom: `1px solid ${COLORS.cardBorder}`, paddingBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>{a.name || t("apptName", lang)}</div>
                    <div style={{ fontSize: "0.72rem", color: COLORS.textDim }}>{t("blackCaseNo", lang)} {a.caseRef.blackNo}</div>
                  </div>
                  <div style={{ fontSize: "0.78rem", color: COLORS.orangeDark, fontWeight: 700, whiteSpace: "nowrap" }}>{a.date} {a.time}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "0.9fr 1.1fr", gap: 18, marginTop: 18 }}>
        <WinRateWidget store={store} lang={lang} />
        <MiniCalendarWidget store={store} lang={lang} onOpenFull={onOpenCalendar} />
      </div>

      <div style={{ marginTop: 20 }}>
        <div style={{ fontWeight: 700, marginBottom: 12 }}>{t("recentCases", lang)}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {store.cases.slice(-5).reverse().map((c) => (
            <div key={c.id} style={{ background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 12, padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: "0.85rem" }}>{t("blackCaseNo", lang)} {c.blackNo}</div>
              <StatusChip value={c.status} lang={lang} small />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
