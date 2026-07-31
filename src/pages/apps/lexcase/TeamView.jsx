import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { COLORS, GRADIENT_ORANGE } from "../../../theme";
import { Modal, Field, TextInput, IconButton } from "./parts";
import { t } from "./constants";
import { makeId } from "./useLexCaseStore";

function initials(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function TeamView({ store, lang }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", position: "", photo: "" });

  const casesFor = (name) => store.cases.filter((c) => (c.ownerTags || []).includes(name)).length;

  const save = () => {
    if (!form.name.trim()) return;
    store.upsertMember({ id: makeId("member"), ...form });
    setForm({ name: "", position: "", photo: "" });
    setOpen(false);
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.3rem", fontWeight: 700 }}>{t("nav_team", lang)}</div>
        <button
          onClick={() => setOpen(true)}
          style={{ display: "flex", alignItems: "center", gap: 8, background: COLORS.orange, color: "#fff", border: "none", borderRadius: 10, padding: "10px 18px", fontWeight: 700, cursor: "pointer" }}
        >
          <Plus size={16} /> {t("addMember", lang)}
        </button>
      </div>

      {store.team.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: COLORS.textDim, border: `1px dashed ${COLORS.cardBorder}`, borderRadius: 16 }}>
          {t("noTeam", lang)}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
          {store.team.map((m) => (
            <div key={m.id} style={{ background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 16, padding: 18, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, position: "relative" }}>
              <div style={{ position: "absolute", top: 10, right: 10 }}>
                <IconButton icon={Trash2} danger onClick={() => store.deleteMember(m.id)} title={t("delete", lang)} />
              </div>
              <div style={{
                width: 60, height: 60, borderRadius: "50%", flexShrink: 0,
                background: m.photo ? `center/cover no-repeat url(${m.photo})` : GRADIENT_ORANGE,
                display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "1.1rem",
              }}>
                {!m.photo && initials(m.name)}
              </div>
              <div style={{ fontWeight: 700, fontSize: "0.92rem", textAlign: "center" }}>{m.name}</div>
              <div style={{ fontSize: "0.78rem", color: COLORS.textDim }}>{m.position}</div>
              <div style={{ fontSize: "0.72rem", background: COLORS.orangeSoft, color: COLORS.orangeDark, borderRadius: 999, padding: "3px 10px", marginTop: 4 }}>
                {t("casesHandled", lang)}: {casesFor(m.name)}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title={t("addMember", lang)} width={440}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Field label={t("memberName", lang)}>
            <TextInput value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </Field>
          <Field label={t("memberPosition", lang)}>
            <TextInput value={form.position} onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))} placeholder={lang === "en" ? "e.g. Associate Lawyer" : "เช่น ทนายความ"} />
          </Field>
          <Field label={t("memberPhotoUrl", lang)}>
            <TextInput value={form.photo} onChange={(e) => setForm((f) => ({ ...f, photo: e.target.value }))} placeholder="https://..." />
          </Field>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button onClick={() => setOpen(false)} style={{ background: COLORS.cardAlt, border: `1px solid ${COLORS.cardBorder}`, color: COLORS.text, borderRadius: 10, padding: "9px 20px", cursor: "pointer", fontWeight: 600 }}>
              {t("cancel", lang)}
            </button>
            <button onClick={save} style={{ background: COLORS.orange, border: "none", color: "#fff", borderRadius: 10, padding: "9px 22px", cursor: "pointer", fontWeight: 700 }}>
              {t("save", lang)}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
