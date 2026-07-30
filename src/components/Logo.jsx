import { COLORS } from "../theme";

function LogoMark({ size }) {
  return (
    <svg
      className="logo-mark"
      width={size}
      height={size}
      viewBox="0 0 1024 1024"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        borderRadius: size * 0.28,
        flexShrink: 0,
        boxShadow: "0 6px 14px -6px rgba(255,4,33,0.45)",
      }}
    >
      <path fill="#FF0421" d="M0 0h1024v1024H0z" />
      <path
        fill="#FAFAF9"
        d="M512.337 60c196.772 0 356.337 159.564 356.337 356.336 0 196.774-159.565 356.34-356.337 356.34v191.296C315.563 963.972 156 804.406 156 607.635c0-196.774 159.563-356.337 356.337-356.337V60Zm-1.651 275.693c-38.71 77.719-96.924 135.931-174.643 174.641v3.303c77.719 38.709 135.933 96.921 174.643 174.64h3.302c38.707-77.719 96.922-135.931 174.641-174.64v-3.303c-77.719-38.71-135.934-96.922-174.641-174.641h-3.302Z"
      />
    </svg>
  );
}

function Logo({ onClick, size = "1.15rem", iconSize = 26 }) {
  return (
    <div
      className="logo-group"
      onClick={onClick}
      style={{ display: "inline-flex", alignItems: "center", gap: 9, cursor: onClick ? "pointer" : "default" }}
    >
      <LogoMark size={iconSize} />
      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: size, letterSpacing: "-0.01em", whiteSpace: "nowrap" }}>
        Obfice{" "}
        <span
          className="logo-word"
          style={{
            background: `linear-gradient(90deg, ${COLORS.red}, ${COLORS.redDark}, ${COLORS.red})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          }}
        >
          Base
        </span>
      </span>
    </div>
  );
}
export default Logo;
