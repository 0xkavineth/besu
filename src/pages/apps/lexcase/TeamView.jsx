import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { COLORS, GRADIENT_ORANGE } from "../../../theme";
import { Modal, Field, TextInput, IconButton } from "./parts";
import { t } from "./constants";
import { makeId } from "./useLexCaseStore";

const DEFAULT_SUB_ACCOUNT_PERMISSIONS = {
  viewCases: true,
  editCases: false,
  manageTeam: false,
  managePermissions: false,
};

const ROLE_OPTIONS = [
  { value: "viewer", label: "Viewer" },
  { value: "manager", label: "Manager" },
  { value: "admin", label: "Admin" },
];

function initials(name) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function TeamView({ store, lang }) {
  const [open, setOpen] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [form, setForm] = useState({
    name: "",
    position: "",
    photo: "",
    email: "",
    password: "",
    role: "viewer",
    permissions: { ...DEFAULT_SUB_ACCOUNT_PERMISSIONS },
  });

  const casesFor = (name) => store.cases.filter((c) => (c.ownerTags || []).includes(name)).length;
  const permissionTags = useMemo(() => {
    return [
      { key: "viewCases", label: "Cases" },
      { key: "editCases", label: "Edit" },
      { key: "manageTeam", label: "Team" },
      { key: "managePermissions", label: "Permissions" },
    ];
  }, []);

  const save = async () => {
    const cleanName = (form.name || "").trim();
    const cleanEmail = (form.email || "").trim().toLowerCase();
    const cleanPassword = (form.password || "").trim();

    if (!cleanName) {
      setSaveError("กรุณากรอกชื่อ-นามสกุล");
      return;
    }
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setSaveError("กรุณากรอกอีเมลให้ถูกต้อง");
      return;
    }
    if (cleanPassword.length < 6) {
      setSaveError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }

    try {
      await store.createTeamMember({
        id: makeId("member"),
        name: cleanName,
        position: form.position || "",
        photo: form.photo || "",
        email: cleanEmail,
        password: cleanPassword,
        role: form.role || "viewer",
        permissions: form.permissions || { ...DEFAULT_SUB_ACCOUNT_PERMISSIONS },
      });

      setSaveError("");
      setForm({
        name: "",
        position: "",
        photo: "",
        email: "",
        password: "",
        role: "viewer",
        permissions: { ...DEFAULT_SUB_ACCOUNT_PERMISSIONS },
      });
      setOpen(false);
    } catch (error) {
      setSaveError(error?.message || "ไม่สามารถสร้าง sub-account ได้");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.3rem", fontWeight: 700 }}>{t("nav_team", lang)}</div>
        <button
          onClick={() => {
            setSaveError("");
            setOpen(true);
          }}
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

      <div style={{ marginTop: 24, borderTop: `1px solid ${COLORS.cardBorder}`, paddingTop: 22 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.05rem", fontWeight: 700 }}>Sub-account access</div>
        </div>

        {store.subAccounts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: COLORS.textDim, border: `1px dashed ${COLORS.cardBorder}`, borderRadius: 16 }}>
            No sub-accounts yet
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
            {store.subAccounts.map((member) => (
              <div key={member.id} style={{ background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 16, padding: 18, display: "flex", flexDirection: "column", gap: 10, position: "relative" }}>
                <div style={{ position: "absolute", top: 10, right: 10 }}>
                  <IconButton icon={Trash2} danger onClick={() => store.deleteSubAccount(member.id)} title="Delete" />
                </div>
                <div style={{ fontWeight: 700 }}>{member.display_name || member.email}</div>
                <div style={{ fontSize: "0.78rem", color: COLORS.textDim }}>{member.email}</div>
                <div style={{ fontSize: "0.72rem", background: COLORS.orangeSoft, color: COLORS.orangeDark, borderRadius: 999, padding: "3px 10px", alignSelf: "flex-start" }}>
                  {member.role || "viewer"}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {permissionTags.filter((tag) => member.permissions?.[tag.key]).map((tag) => (
                    <span key={tag.key} style={{ fontSize: "0.7rem", padding: "3px 8px", borderRadius: 999, background: COLORS.cardAlt, color: COLORS.text }}>
                      {tag.label}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={open} onClose={() => {
        setSaveError("");
        setOpen(false);
      }} title={t("addMember", lang)} width={440}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {saveError && (
            <div style={{ padding: "10px 12px", borderRadius: 10, background: "rgba(239,68,68,0.09)", color: "#b91c1c", fontSize: "0.8rem", border: "1px solid rgba(239,68,68,0.25)" }}>
              {saveError}
            </div>
          )}
          <Field label={t("memberName", lang)}>
            <TextInput value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </Field>
          <Field label={t("memberPosition", lang)}>
            <TextInput value={form.position} onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))} placeholder={lang === "en" ? "e.g. Associate Lawyer" : "เช่น ทนายความ"} />
          </Field>
          <Field label={t("memberPhotoUrl", lang)}>
            <TextInput value={form.photo} onChange={(e) => setForm((f) => ({ ...f, photo: e.target.value }))} placeholder="https://..." />
          </Field>
          <Field label="Email (sub-account)">
            <TextInput type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="member@company.com" />
          </Field>
          <Field label="Password">
            <TextInput type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} placeholder="Minimum 6 characters" />
          </Field>
          <Field label="Role">
            <select
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 10, border: `1px solid ${COLORS.cardBorder}`, background: COLORS.card, color: COLORS.text }}
            >
              {ROLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </Field>
          <div>
            <div style={{ fontSize: "0.8rem", fontWeight: 700, marginBottom: 8 }}>Permissions</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 10 }}>
              {permissionTags.map((tag) => (
                <label key={tag.key} style={{ display: "flex", alignItems: "center", gap: 8, background: COLORS.cardAlt, padding: "10px 12px", borderRadius: 10 }}>
                  <input
                    type="checkbox"
                    checked={!!form.permissions[tag.key]}
                    onChange={() => setForm((current) => ({
                      ...current,
                      permissions: {
                        ...current.permissions,
                        [tag.key]: !current.permissions[tag.key],
                      },
                    }))}
                  />
                  <span style={{ fontSize: "0.8rem" }}>{tag.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button onClick={() => {
              setSaveError("");
              setOpen(false);
            }} style={{ background: COLORS.cardAlt, border: `1px solid ${COLORS.cardBorder}`, color: COLORS.text, borderRadius: 10, padding: "9px 20px", cursor: "pointer", fontWeight: 600 }}>
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
