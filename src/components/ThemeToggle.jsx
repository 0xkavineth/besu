import { useEffect, useRef, useState } from "react";
import { Sun, Moon, Coffee, Leaf, Sparkles, ChevronDown, Check } from "lucide-react";
import { COLORS } from "../theme";
import { useThemeMode } from "../themeStore";

const MODE_ICON = { light: Sun, dark: Moon, coffee: Coffee, matcha: Leaf, space: Sparkles };
const MODE_ACCENT = {
  light: { color: COLORS.text, soft: COLORS.cardAlt },
  dark: { color: "#c9c6ff", soft: "rgba(160,150,255,0.14)" },
  coffee: { color: "#8a5a2b", soft: "rgba(138,90,43,0.14)" },
  matcha: { color: "#4d7c2e", soft: "rgba(77,124,46,0.14)" },
  space: { color: "#2f6fe0", soft: "rgba(79,142,247,0.14)" },
};
const MODE_LABEL = { light: "สว่าง", dark: "มืด", coffee: "กาแฟ", matcha: "มัทฉะ", space: "อวกาศ" };

// Dropdown that lets the user pick a theme directly instead of
// cycling through Light -> Dark -> Coffee -> Matcha -> Space -> Light.
function ThemeToggle({ style }) {
  const { mode, setMode, themes } = useThemeMode();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const Icon = MODE_ICON[mode] || Sun;
  const accent = MODE_ACCENT[mode] || MODE_ACCENT.light;
  const label = MODE_LABEL[mode] || "สว่าง";

  return (
    <div ref={ref} style={{ position: "relative", flexShrink: 0, ...style }}>
      <button
        onClick={() => setOpen((v) => !v)}
        title={`ธีม: ${label} — คลิกเพื่อเลือกธีม`}
        aria-label="เลือกธีม"
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{
          height: 36, borderRadius: 999, border: `1px solid ${COLORS.cardBorder}`,
          background: accent.soft, color: accent.color, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 7, padding: "0 11px 0 11px",
          transition: "background 200ms ease, color 200ms ease, border-color 200ms ease",
          fontSize: "0.78rem", fontWeight: 700, whiteSpace: "nowrap",
        }}
      >
        <Icon size={16} strokeWidth={2.1} />
        {label}
        <ChevronDown size={13} style={{ transition: "transform 160ms ease", transform: open ? "rotate(180deg)" : "none" }} />
      </button>

      {open && (
        <div
          role="listbox"
          style={{
            position: "absolute", right: 0, top: 42, minWidth: 168, background: COLORS.card,
            border: `1px solid ${COLORS.cardBorder}`, borderRadius: 12,
            boxShadow: "0 20px 40px -16px rgba(20,18,30,0.2)", padding: 6, zIndex: 30,
          }}
        >
          {themes.map((th) => {
            const ThIcon = MODE_ICON[th.key] || Sun;
            const thAccent = MODE_ACCENT[th.key] || MODE_ACCENT.light;
            const active = th.key === mode;
            return (
              <button
                key={th.key}
                role="option"
                aria-selected={active}
                onClick={() => { setMode(th.key); setOpen(false); }}
                style={{
                  display: "flex", alignItems: "center", gap: 9, width: "100%", textAlign: "left",
                  padding: "8px 10px", borderRadius: 8, border: "none", cursor: "pointer",
                  background: active ? thAccent.soft : "transparent", color: active ? thAccent.color : COLORS.text,
                  fontSize: "0.82rem", fontWeight: active ? 700 : 500,
                }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = COLORS.cardAlt; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
              >
                <ThIcon size={15} color={thAccent.color} />
                <span style={{ flex: 1 }}>{th.label}</span>
                {active && <Check size={13} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ThemeToggle;
