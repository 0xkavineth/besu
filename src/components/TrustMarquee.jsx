import { COLORS } from "../theme";
import { TRUST_ITEMS } from "../data";

function TrustMarquee() {
  const items = [...TRUST_ITEMS, ...TRUST_ITEMS];
  return (
    <div style={{ overflow: "hidden", position: "relative", zIndex: 2, padding: "18px 0", borderTop: `1px solid ${COLORS.cardBorder}`, borderBottom: `1px solid ${COLORS.cardBorder}` }}>
      <div style={{ textAlign: "center", fontSize: "0.75rem", color: COLORS.textDim, marginBottom: 14 }}>ได้รับความไว้วางใจจากสำนักงานทั่วประเทศ</div>
      <div style={{ display: "flex", width: "max-content", animation: "marquee 26s linear infinite", gap: 40 }}>
        {items.map((name, i) => (
          <span key={i} style={{ fontSize: "0.9rem", color: COLORS.textDim, fontWeight: 600, whiteSpace: "nowrap", opacity: 0.7 }}>{name}</span>
        ))}
      </div>
    </div>
  );
}
export default TrustMarquee;
