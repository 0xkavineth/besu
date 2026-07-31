import { useEffect, useRef, useState } from "react";
import { X, Plus, Calendar as CalendarIcon, Trash2, Search } from "lucide-react";
import { COLORS, GRADIENT_ORANGE } from "../../../theme";
import { statusMeta, t } from "./constants";

function initialsOf(name) {
  const parts = (name || "").trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

// Small circular avatar used everywhere a team member / case owner
// needs to be shown: falls back to initials-on-gradient when no photo.
export function Avatar({ name, photo, size = 26 }) {
  return (
    <div
      title={name}
      style={{
        width: size, height: size, borderRadius: "50%", flexShrink: 0,
        background: photo ? `center/cover no-repeat url(${photo})` : GRADIENT_ORANGE,
        display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700,
        fontSize: size * 0.4, overflow: "hidden",
      }}
    >
      {!photo && initialsOf(name)}
    </div>
  );
}

// Chip that pairs an Avatar with a name — used for owner lists in
// tables, case detail, and the calendar.
export function OwnerChip({ name, photo, small }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: COLORS.orangeSoft, color: COLORS.orangeDark, borderRadius: 999, padding: small ? "2px 8px 2px 2px" : "3px 10px 3px 3px", fontSize: small ? "0.72rem" : "0.78rem", fontWeight: 600 }}>
      <Avatar name={name} photo={photo} size={small ? 18 : 22} />
      {name}
    </span>
  );
}

// Multi-select restricted to existing team members only — no free-text
// creation. Enforces "must add to team before assigning as case owner".
export function TeamPickMultiSelect({ team, values, onChange, lang }) {
  const toggle = (name) => {
    if (values.includes(name)) onChange(values.filter((x) => x !== name));
    else onChange([...values, name]);
  };

  if (!team || team.length === 0) {
    return (
      <div style={{ fontSize: "0.8rem", color: COLORS.textDim, background: COLORS.cardAlt, borderRadius: 10, padding: "10px 12px" }}>
        {t("noTeamForOwner", lang)}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {values.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {values.map((v) => {
            const member = team.find((m) => m.name === v);
            return (
              <span key={v} style={{
                display: "inline-flex", alignItems: "center", gap: 6, background: COLORS.orangeSoft,
                color: COLORS.orangeDark, borderRadius: 999, padding: "3px 6px 3px 3px", fontSize: "0.78rem", fontWeight: 600,
              }}>
                <Avatar name={v} photo={member?.photo} size={20} />
                {v}
                <button
                  onClick={() => toggle(v)}
                  type="button"
                  style={{ background: "none", border: "none", cursor: "pointer", display: "flex", color: COLORS.orangeDark, padding: 2 }}
                >
                  <X size={12} />
                </button>
              </span>
            );
          })}
        </div>
      )}
      <div style={{ fontSize: "0.72rem", color: COLORS.textDim }}>{t("pickOwnerFromTeam", lang)}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {team.filter((m) => !values.includes(m.name)).map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => toggle(m.name)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: "0.78rem", padding: "3px 10px 3px 3px",
              borderRadius: 999, border: `1px solid ${COLORS.cardBorder}`, color: COLORS.text, background: "transparent",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = COLORS.orange)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = COLORS.cardBorder)}
          >
            <Avatar name={m.name} photo={m.photo} size={20} />
            {m.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Field({ label, children, style }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
      <div style={{ fontSize: "0.78rem", fontWeight: 600, color: COLORS.textDim }}>{label}</div>
      {children}
    </div>
  );
}

const inputBase = {
  background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 10,
  padding: "9px 12px", fontSize: "0.88rem", color: COLORS.text, outline: "none", width: "100%",
  fontFamily: "inherit",
};

export function TextInput(props) {
  return <input {...props} style={{ ...inputBase, ...(props.style || {}) }} />;
}

export function Select({ options, value, onChange, placeholder, style }) {
  return (
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      style={{ ...inputBase, cursor: "pointer", ...style }}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

export function StatusChip({ value, lang, small }) {
  const meta = statusMeta(value);
  const label = lang === "en" ? meta.en : meta.th;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6, padding: small ? "3px 9px" : "5px 12px",
      borderRadius: 999, fontSize: small ? "0.72rem" : "0.78rem", fontWeight: 700,
      background: meta.soft, color: meta.color, whiteSpace: "nowrap",
    }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: meta.color }} />
      {label}
    </span>
  );
}

// Creatable multi-select: shows chips for selected values, a dropdown
// of existing options, and a text box to type + Enter a brand-new one
// which is remembered (persisted) for next time.
export function MultiSelectCreatable({ options, values, onChange, onCreate, placeholder }) {
  const [text, setText] = useState("");

  const toggle = (v) => {
    if (values.includes(v)) onChange(values.filter((x) => x !== v));
    else onChange([...values, v]);
  };

  const commitText = () => {
    const clean = text.trim();
    if (!clean) return;
    if (onCreate) onCreate(clean);
    if (!values.includes(clean)) onChange([...values, clean]);
    setText("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {values.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {values.map((v) => (
            <span key={v} style={{
              display: "inline-flex", alignItems: "center", gap: 6, background: COLORS.orangeSoft,
              color: COLORS.orangeDark, borderRadius: 999, padding: "4px 6px 4px 12px", fontSize: "0.78rem", fontWeight: 600,
            }}>
              {v}
              <button
                onClick={() => toggle(v)}
                style={{ background: "none", border: "none", cursor: "pointer", display: "flex", color: COLORS.orangeDark, padding: 2 }}
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
      <div style={{ display: "flex", gap: 8 }}>
        <TextInput
          value={text}
          placeholder={placeholder}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); commitText(); } }}
        />
        <button
          onClick={commitText}
          type="button"
          style={{ background: COLORS.orangeSoft, border: `1px solid ${COLORS.orangeSoft2}`, color: COLORS.orangeDark, borderRadius: 10, padding: "0 12px", cursor: "pointer", display: "flex", alignItems: "center" }}
        >
          <Plus size={16} />
        </button>
      </div>
      {options.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {options.filter((o) => !values.includes(o)).slice(0, 14).map((o) => (
            <span
              key={o}
              onClick={() => toggle(o)}
              style={{
                cursor: "pointer", fontSize: "0.76rem", padding: "4px 10px", borderRadius: 999,
                border: `1px solid ${COLORS.cardBorder}`, color: COLORS.textDim,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = COLORS.orange)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = COLORS.cardBorder)}
            >
              + {o}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// Free-text court field that matches what's typed against the court list
// (substring match, so partial names like "อุดร" find "ศาลจังหวัดอุดรธานี")
// but still accepts any typed value that isn't in the list — court names
// change/get added over time and staff shouldn't be blocked by the list.
export function CourtCombobox({ options, value, onChange, lang, placeholder }) {
  const selected = options.find((o) => o.value === value);
  const [text, setText] = useState(selected ? selected.label : (value || ""));
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const match = options.find((o) => o.value === value);
    setText(match ? match.label : (value || ""));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    function onDocClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const q = text.trim().toLowerCase();
  const matches = q
    ? options.filter((o) => o.label.toLowerCase().includes(q)).slice(0, 30)
    : options.slice(0, 30);

  const pick = (opt) => {
    setText(opt.label);
    onChange(opt.value);
    setOpen(false);
  };

  const commitFreeText = () => {
    const clean = text.trim();
    if (!clean) { onChange(""); return; }
    const exact = options.find((o) => o.label === clean);
    onChange(exact ? exact.value : clean);
    setOpen(false);
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div style={{ position: "relative" }}>
        <Search size={14} color={COLORS.textDim} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
        <TextInput
          value={text}
          onChange={(e) => { setText(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); commitFreeText(); } if (e.key === "Escape") setOpen(false); }}
          onBlur={commitFreeText}
          placeholder={placeholder || t("courtSearchPlaceholder", lang)}
          style={{ paddingLeft: 32 }}
        />
      </div>
      {open && (
        <div style={{
          position: "absolute", left: 0, right: 0, top: "calc(100% + 4px)", maxHeight: 260, overflowY: "auto",
          background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 12,
          boxShadow: "0 20px 40px -16px rgba(20,18,30,0.2)", padding: 6, zIndex: 40,
        }}>
          {matches.length === 0 ? (
            <div style={{ padding: "10px 10px", fontSize: "0.78rem", color: COLORS.textDim }}>
              {t("courtNoMatch", lang)}
            </div>
          ) : (
            matches.map((o) => (
              <button
                key={o.value}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); pick(o); }}
                style={{
                  display: "block", width: "100%", textAlign: "left", padding: "8px 10px", borderRadius: 8,
                  border: "none", background: o.value === value ? COLORS.orangeSoft : "transparent",
                  color: o.value === value ? COLORS.orangeDark : COLORS.text, fontSize: "0.82rem", cursor: "pointer",
                }}
                onMouseEnter={(e) => { if (o.value !== value) e.currentTarget.style.background = COLORS.cardAlt; }}
                onMouseLeave={(e) => { if (o.value !== value) e.currentTarget.style.background = "transparent"; }}
              >
                {o.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export function Modal({ open, onClose, title, width = 640, children, accent = COLORS.orange }) {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(10,10,15,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: COLORS.card, borderRadius: 18, width: "100%", maxWidth: width, maxHeight: "88vh", overflowY: "auto", boxShadow: "0 30px 60px -20px rgba(0,0,0,0.35)" }}>
        <div style={{ position: "sticky", top: 0, background: COLORS.card, borderBottom: `1px solid ${COLORS.cardBorder}`, padding: "16px 22px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 1 }}>
          <div style={{ fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: accent }}>{title}</div>
          <button onClick={onClose} style={{ background: COLORS.cardAlt, border: "none", color: COLORS.text, borderRadius: 8, padding: 6, cursor: "pointer", display: "flex" }}>
            <X size={16} />
          </button>
        </div>
        <div style={{ padding: 22 }}>{children}</div>
      </div>
    </div>
  );
}

export function IconButton({ icon: Icon, onClick, danger, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        background: danger ? "rgba(239,68,68,0.1)" : COLORS.cardAlt, border: "none", borderRadius: 8,
        padding: 7, cursor: "pointer", display: "flex", color: danger ? "#ef4444" : COLORS.textDim,
      }}
    >
      <Icon size={15} />
    </button>
  );
}

export { CalendarIcon, Trash2 };
