import { useMemo, useState } from "react";
import { COLORS } from "../../../theme";
import { CASE_STATUSES, CASE_TYPES, tv, t } from "./constants";

const PALETTE = ["#f97316", "#0ea5e9", "#22c55e", "#8b5cf6", "#ec4899", "#eab308", "#ef4444", "#14b8a6"];

function Bubbles({ data, lang }) {
  const total = data.reduce((s, d) => s + d.count, 0) || 1;
  const maxCount = Math.max(1, ...data.map((d) => d.count));
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 14, alignItems: "center", justifyContent: "center", padding: "20px 10px", minHeight: 180 }}>
      {data.filter((d) => d.count > 0).map((d, i) => {
        const size = 54 + Math.round((d.count / maxCount) * 110);
        return (
          <div
            key={d.key}
            title={`${d.label}: ${d.count}`}
            style={{
              width: size, height: size, borderRadius: "50%", background: d.color || PALETTE[i % PALETTE.length],
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#fff",
              fontWeight: 700, textAlign: "center", padding: 6, flexShrink: 0, boxShadow: "0 8px 20px -8px rgba(0,0,0,0.25)",
            }}
          >
            <div style={{ fontSize: size > 90 ? "1.3rem" : "1rem" }}>{d.count}</div>
            <div style={{ fontSize: "0.62rem", opacity: 0.92, lineHeight: 1.2, marginTop: 2 }}>{d.label}</div>
          </div>
        );
      })}
      {data.every((d) => d.count === 0) && (
        <div style={{ color: COLORS.textDim, fontSize: "0.85rem" }}>—</div>
      )}
    </div>
  );
}

export default function SummaryView({ store, lang }) {
  const [tab, setTab] = useState("status");

  const byStatus = useMemo(() => CASE_STATUSES.map((s) => ({
    key: s.value, label: tv(s, lang), color: s.color,
    count: store.cases.filter((c) => c.status === s.value).length,
  })), [store.cases, lang]);

  const byType = useMemo(() => CASE_TYPES.map((tt, i) => ({
    key: tt.value, label: tv(tt, lang), color: PALETTE[i % PALETTE.length],
    count: store.cases.filter((c) => c.caseType === tt.value).length,
  })), [store.cases, lang]);

  const byOwner = useMemo(() => {
    const map = {};
    store.cases.forEach((c) => (c.ownerTags || []).forEach((o) => { map[o] = (map[o] || 0) + 1; }));
    return Object.entries(map).map(([label, count], i) => ({ key: label, label, count, color: PALETTE[i % PALETTE.length] }));
  }, [store.cases]);

  const tabs = [
    { key: "status", label: t("byStatus", lang), data: byStatus },
    { key: "type", label: t("byType", lang), data: byType },
    { key: "owner", label: t("byOwner", lang), data: byOwner },
  ];
  const active = tabs.find((tt) => tt.key === tab) || tabs[0];

  return (
    <div>
      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.3rem", fontWeight: 700, marginBottom: 18 }}>
        {t("summaryTitle", lang)}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {tabs.map((tt) => (
          <button
            key={tt.key}
            onClick={() => setTab(tt.key)}
            style={{
              background: tab === tt.key ? COLORS.orange : COLORS.cardAlt, color: tab === tt.key ? "#fff" : COLORS.text,
              border: "none", borderRadius: 999, padding: "8px 16px", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer",
            }}
          >
            {tt.label}
          </button>
        ))}
      </div>

      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 18 }}>
        <Bubbles data={active.data} lang={lang} />
      </div>

      <div style={{ marginTop: 16, fontSize: "0.8rem", color: COLORS.textDim, textAlign: "center" }}>
        {t("totalCases", lang)}: {store.cases.length} {t("cases_unit", lang)}
      </div>
    </div>
  );
}
