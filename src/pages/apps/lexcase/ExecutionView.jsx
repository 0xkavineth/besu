import { Lock, Plus } from "lucide-react";
import { COLORS } from "../../../theme";
import { StatusChip } from "./parts";
import { t } from "./constants";
import { COURTS } from "./courts";

const courtLabel = (value) => COURTS.find((c) => c.value === value)?.label || value;

export default function ExecutionView({ store, lang }) {
  const executionCases = store.cases.filter((c) => c.status === "execution");

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, flexWrap: "wrap", gap: 10 }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.3rem", fontWeight: 700 }}>{t("nav_execution", lang)}</div>
        <button
          disabled
          title={t("comingSoon", lang)}
          style={{
            display: "flex", alignItems: "center", gap: 8, background: COLORS.cardAlt, color: COLORS.textDim,
            border: `1px solid ${COLORS.cardBorder}`, borderRadius: 10, padding: "10px 16px", fontWeight: 700, cursor: "not-allowed",
          }}
        >
          <Lock size={14} /> <Plus size={14} /> {t("comingSoon", lang)}
        </button>
      </div>
      <div style={{ fontSize: "0.82rem", color: COLORS.textDim, marginBottom: 20 }}>{t("executionDesc", lang)}</div>

      {executionCases.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: COLORS.textDim, border: `1px dashed ${COLORS.cardBorder}`, borderRadius: 16 }}>
          {t("noExecution", lang)}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {executionCases.map((c) => (
            <div key={c.id} style={{
              background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 14, padding: "14px 18px",
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap",
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>{t("blackCaseNo", lang)} {c.blackNo}</div>
                <div style={{ fontSize: "0.8rem", color: COLORS.textDim, marginTop: 3 }}>{courtLabel(c.court)}</div>
                {c.ownerTags?.length > 0 && (
                  <div style={{ fontSize: "0.75rem", color: COLORS.orangeDark, marginTop: 4 }}>{t("caseOwner", lang)}: {c.ownerTags.join(", ")}</div>
                )}
              </div>
              <StatusChip value={c.status} lang={lang} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
