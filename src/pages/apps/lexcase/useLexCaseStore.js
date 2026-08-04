import { useCallback, useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import { DEFAULT_CHARGES } from "./constants";

// ---------------------------------------------
// LexCase app data now lives in Supabase (see supabase/schema.sql),
// scoped per signed-in user via Row Level Security — this is what
// makes it show up again when the same account logs in from a
// different device. `userId` is the Supabase auth user id (a uuid),
// not the email, since RLS policies compare against auth.uid().
//
// Local React state is kept as the source of truth for rendering
// (so the UI stays instant/optimistic); every mutation also fires
// an async write to Supabase in the background. Writes are best-
// effort: failures are logged to the console rather than blocking
// the UI, matching how localStorage writes silently could not fail
// before either.
// ---------------------------------------------

const LANG_KEY = "lexcase_lang";

function loadLang() {
  try {
    return localStorage.getItem(LANG_KEY) || "th";
  } catch {
    return "th";
  }
}

function saveLang(lang) {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {
    // ignore storage errors (e.g. private browsing / quota)
  }
}

// ---------------------------------------------
// Local cache (per signed-in user): a safety net that sits alongside
// Supabase. Supabase is still the source of truth for cross-device
// sync, but a single flaky/slow/misconfigured read should never blank
// the screen — that's what was happening before: the load effect ran
// on every remount of the LexCase page (i.e. every time someone left
// and came back) and, on ANY read error, replaced local state with an
// empty array. Now a failed read just keeps showing the last known-
// good data instead of wiping it, and writes are mirrored here too so
// the UI survives even if a background Supabase write never lands.
// ---------------------------------------------
const cacheKey = (userId) => `lexcase_cache_${userId}`;

function loadCache(userId) {
  try {
    const raw = localStorage.getItem(cacheKey(userId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveCache(userId, snapshot) {
  try {
    localStorage.setItem(cacheKey(userId), JSON.stringify(snapshot));
  } catch {
    // ignore storage errors (e.g. private browsing / quota)
  }
}

function logError(action, error) {
  if (error) {
    // eslint-disable-next-line no-console
    console.error(`LexCase: failed to ${action}:`, error.message);
  }
}

let uidCounter = 0;
export function makeId(prefix = "id") {
  uidCounter += 1;
  return `${prefix}_${Date.now().toString(36)}_${uidCounter}`;
}

export const ROLE_PERMISSIONS = {
  viewer: {
    viewCases: true,
    editCases: false,
    manageTeam: false,
    managePermissions: false,
  },
  manager: {
    viewCases: true,
    editCases: true,
    manageTeam: true,
    managePermissions: false,
  },
  admin: {
    viewCases: true,
    editCases: true,
    manageTeam: true,
    managePermissions: true,
  },
};

export function useLexCaseStore(userId) {
  const [cases, setCases] = useState([]);
  const [team, setTeam] = useState([]);
  const [subAccounts, setSubAccounts] = useState([]);
  const [charges, setCharges] = useState(DEFAULT_CHARGES);
  const [lang, setLang] = useState(() => loadLang());
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState(false);

  const persistSnapshot = useCallback((nextCases = cases, nextTeam = team, nextCharges = charges, nextSubAccounts = subAccounts) => {
    if (!userId) return;
    saveCache(userId, { cases: nextCases, team: nextTeam, charges: nextCharges, subAccounts: nextSubAccounts });
  }, [userId, cases, team, charges, subAccounts]);

  // Load everything for the signed-in user whenever the user changes
  // (login, logout, switching accounts, or simply navigating back
  // into the LexCase page — this whole hook remounts fresh every
  // time, so this effect runs again).
  useEffect(() => {
    if (!userId) {
      setCases([]);
      setTeam([]);
      setSubAccounts([]);
      setCharges(DEFAULT_CHARGES);
      setLoading(false);
      setSyncError(false);
      return;
    }

    // Show the last known-good snapshot immediately — no blank screen
    // while the network round-trip to Supabase is in flight.
    const cached = loadCache(userId);
    if (cached) {
      setCases(cached.cases || []);
      setTeam(cached.team || []);
      setSubAccounts(cached.subAccounts || []);
      setCharges(cached.charges?.length ? cached.charges : DEFAULT_CHARGES);
      setLoading(false);
    } else {
      setLoading(true);
    }

    let cancelled = false;
    (async () => {
      const [casesRes, teamRes, subAccountsRes, chargesRes] = await Promise.all([
        supabase.from("cases").select("id, data").eq("user_id", userId),
        supabase.from("team_members").select("id, name, position, photo").eq("user_id", userId).order("created_at"),
        supabase.from("lexcase_sub_accounts").select("id, email, display_name, role, permissions, status").eq("user_id", userId).order("created_at"),
        supabase.from("charges").select("label").eq("user_id", userId),
      ]);
      if (cancelled) return;
      logError("load cases", casesRes.error);
      logError("load team", teamRes.error);
      logError("load sub-accounts", subAccountsRes.error);
      logError("load charges", chargesRes.error);

      const anyError = !!(casesRes.error || teamRes.error || subAccountsRes.error || chargesRes.error);
      setSyncError(anyError);

      // Only trust Supabase's answer when the read actually succeeded.
      // A failed read (RLS hiccup, cold start, dropped connection...)
      // must NOT overwrite whatever we already have on screen/cache —
      // that's what was wiping data on every return visit before.
      if (!casesRes.error) {
        const nextCases = (casesRes.data || []).map((row) => ({ ...row.data, id: row.id }));
        setCases(nextCases);
      }
      if (!teamRes.error) {
        setTeam(teamRes.data || []);
      }
      if (!subAccountsRes.error) {
        setSubAccounts(subAccountsRes.data || []);
      }
      if (!chargesRes.error) {
        const labels = (chargesRes.data || []).map((row) => row.label);
        setCharges(labels.length ? labels : DEFAULT_CHARGES);
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [userId]);

  // Mirror local state into the per-user cache on every change, so the
  // next mount (e.g. navigating back into the page) has an instant,
  // reliable fallback regardless of Supabase's availability.
  useEffect(() => {
    if (!userId) return;
    saveCache(userId, { cases, team, charges, subAccounts });
  }, [userId, cases, team, charges, subAccounts]);

  useEffect(() => { saveLang(lang); }, [lang]);

  const toggleLang = useCallback(() => {
    setLang((l) => (l === "th" ? "en" : "th"));
  }, []);

  const upsertCase = useCallback((record) => {
    const now = new Date().toISOString();
    const finalId = record.id || makeId("case");
    const prev = cases.find((c) => c.id === finalId);
    const toPersist = { ...record, id: finalId, createdAt: prev?.createdAt || record.createdAt || now, updatedAt: now };
    setCases((current) => {
      const idx = current.findIndex((c) => c.id === finalId);
      const nextCases = idx === -1 ? [...current, toPersist] : [...current.slice(0, idx), toPersist, ...current.slice(idx + 1)];
      persistSnapshot(nextCases, team, charges);
      return nextCases;
    });
    if (userId) {
      const { id, ...data } = toPersist;
      supabase.from("cases").upsert({ id, user_id: userId, data, updated_at: now })
        .then(({ error }) => logError("save case", error));
    }
  }, [userId, cases, team, charges, persistSnapshot]);

  // Used by Excel/CSV import: takes many records at once, updates local
  // state in a single pass, and — critically — does ONE batched Supabase
  // upsert that the caller can await. This replaces calling upsertCase()
  // in a loop, which fired one fire-and-forget network request per row;
  // if any of those silently failed (rate limit, dropped connection,
  // etc.) the import screen still said "success" even though the rows
  // were never actually saved, so they'd vanish the next time the data
  // was reloaded from Supabase. Returns { savedCount, error }.
  const bulkUpsertCases = useCallback(async (records) => {
    const now = new Date().toISOString();
    const byId = new Map(cases.map((c) => [c.id, c]));
    const finalized = records.map((record) => {
      const finalId = record.id || makeId("case");
      const prev = byId.get(finalId);
      const next = { ...record, id: finalId, createdAt: prev?.createdAt || record.createdAt || now, updatedAt: now };
      byId.set(finalId, next);
      return next;
    });
    const nextCases = Array.from(byId.values());
    setCases(nextCases);
    persistSnapshot(nextCases, team, charges);

    if (!userId || finalized.length === 0) return { savedCount: finalized.length, error: null };

    const rows = finalized.map(({ id, ...data }) => ({ id, user_id: userId, data, updated_at: now }));
    const { error } = await supabase.from("cases").upsert(rows);
    logError("bulk-save cases", error);
    return { savedCount: error ? 0 : finalized.length, error };
  }, [userId, cases, team, charges, persistSnapshot]);

  const deleteCase = useCallback((id) => {
    const nextCases = cases.filter((c) => c.id !== id);
    setCases(nextCases);
    persistSnapshot(nextCases, team, charges);
    if (userId) {
      supabase.from("cases").delete().eq("id", id).eq("user_id", userId)
        .then(({ error }) => logError("delete case", error));
    }
  }, [userId, cases, team, charges, persistSnapshot]);

  // Documents attached to a case's "เอกสารในสำนวน" tab.
  // doc: { id, title, effectiveDate, fileName, fileData (base64), uploadedAt, uploadedBy }
  const addCaseDocument = useCallback((caseId, doc) => {
    const now = new Date().toISOString();
    const current = cases.find((c) => c.id === caseId);
    if (!current) return;
    const toPersist = { ...current, documents: [...(current.documents || []), doc], updatedAt: now };
    const nextCases = cases.map((c) => (c.id === caseId ? toPersist : c));
    setCases(nextCases);
    persistSnapshot(nextCases, team, charges);
    if (userId) {
      const { id, ...data } = toPersist;
      supabase.from("cases").upsert({ id, user_id: userId, data, updated_at: now })
        .then(({ error }) => logError("save case document", error));
    }
  }, [userId, cases, team, charges, persistSnapshot]);

  const deleteCaseDocument = useCallback((caseId, docId) => {
    const now = new Date().toISOString();
    const current = cases.find((c) => c.id === caseId);
    if (!current) return;
    const toPersist = { ...current, documents: (current.documents || []).filter((d) => d.id !== docId), updatedAt: now };
    const nextCases = cases.map((c) => (c.id === caseId ? toPersist : c));
    setCases(nextCases);
    persistSnapshot(nextCases, team, charges);
    if (userId) {
      const { id, ...data } = toPersist;
      supabase.from("cases").upsert({ id, user_id: userId, data, updated_at: now })
        .then(({ error }) => logError("remove case document", error));
    }
  }, [userId, cases, team, charges, persistSnapshot]);

  const addCharge = useCallback((label) => {
    const clean = (label || "").trim();
    if (!clean) return;
    const nextCharges = charges.includes(clean) ? charges : [...charges, clean];
    setCharges(nextCharges);
    persistSnapshot(cases, team, nextCharges);
    if (userId) {
      supabase.from("charges").upsert({ user_id: userId, label: clean })
        .then(({ error }) => logError("save charge", error));
    }
  }, [userId, cases, team, charges, persistSnapshot]);

  const upsertMember = useCallback((record) => {
    const nextTeam = (() => {
      const idx = team.findIndex((m) => m.id === record.id);
      if (idx === -1) return [...team, record];
      const next = [...team];
      next[idx] = record;
      return next;
    })();
    setTeam(nextTeam);
    persistSnapshot(cases, nextTeam, charges, subAccounts);
    if (userId) {
      const { id, name, position, photo } = record;
      supabase.from("team_members").upsert({ id, user_id: userId, name, position: position || "", photo: photo || null })
        .then(({ error }) => logError("save team member", error));
    }
  }, [userId, cases, team, charges, subAccounts, persistSnapshot]);

  const createTeamMember = useCallback(async (record) => {
    if (!userId) return null;
    const cleanEmail = (record.email || "").trim().toLowerCase();
    const cleanName = (record.name || "").trim();
    const cleanPassword = (record.password || "").trim();
    const role = record.role || "viewer";
    const permissions = record.permissions || {};

    if (!cleanName) throw new Error("กรุณากรอกชื่อ-นามสกุล");
    if (!cleanEmail || !cleanEmail.includes("@")) throw new Error("กรุณากรอกอีเมลให้ถูกต้อง");
    if (cleanPassword.length < 6) throw new Error("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: cleanEmail,
      password: cleanPassword,
      options: { data: { name: cleanName } },
    });
    if (signUpError) throw new Error(signUpError.message);

    const authUserId = signUpData?.user?.id || null;
    const teamMemberId = record.id || makeId("member");
    const subAccountId = authUserId || makeId("subaccount");

    const nextTeam = [...team, { id: teamMemberId, name: cleanName, position: record.position || "", photo: record.photo || "" }];
    setTeam(nextTeam);
    persistSnapshot(cases, nextTeam, charges, subAccounts);

    const memberSync = await supabase.from("team_members").upsert({
      id: teamMemberId,
      user_id: userId,
      name: cleanName,
      position: record.position || "",
      photo: record.photo || null,
    });
    logError("save team member", memberSync.error);

    const subAccountSync = await supabase.from("lexcase_sub_accounts").upsert({
      id: subAccountId,
      user_id: userId,
      auth_user_id: authUserId,
      email: cleanEmail,
      display_name: cleanName,
      role,
      permissions: {
        viewCases: true,
        editCases: permissions?.editCases ?? false,
        manageTeam: permissions?.manageTeam ?? false,
        managePermissions: permissions?.managePermissions ?? false,
      },
      status: authUserId ? "active" : "pending",
    });
    logError("save sub-account", subAccountSync.error);

    const nextSubAccounts = [...subAccounts, {
      id: subAccountId,
      email: cleanEmail,
      display_name: cleanName,
      role,
      permissions: {
        viewCases: true,
        editCases: permissions?.editCases ?? false,
        manageTeam: permissions?.manageTeam ?? false,
        managePermissions: permissions?.managePermissions ?? false,
      },
      status: authUserId ? "active" : "pending",
    }];
    setSubAccounts(nextSubAccounts);
    persistSnapshot(cases, nextTeam, charges, nextSubAccounts);

    return { teamMemberId, subAccountId, authUserId };
  }, [userId, cases, team, charges, subAccounts, persistSnapshot]);

  const deleteMember = useCallback((id) => {
    const nextTeam = team.filter((m) => m.id !== id);
    setTeam(nextTeam);
    persistSnapshot(cases, nextTeam, charges, subAccounts);
    if (userId) {
      supabase.from("team_members").delete().eq("id", id).eq("user_id", userId)
        .then(({ error }) => logError("delete team member", error));
    }
  }, [userId, cases, team, charges, subAccounts, persistSnapshot]);

  const upsertSubAccount = useCallback((record) => {
    const nextSubAccounts = (() => {
      const idx = subAccounts.findIndex((m) => m.id === record.id);
      if (idx === -1) return [...subAccounts, record];
      const next = [...subAccounts];
      next[idx] = record;
      return next;
    })();
    setSubAccounts(nextSubAccounts);
    persistSnapshot(cases, team, charges, nextSubAccounts);
    if (userId) {
      const { id, email, display_name, role, permissions, status } = record;
      supabase.from("lexcase_sub_accounts").upsert({
        id,
        user_id: userId,
        email: (email || "").trim().toLowerCase(),
        display_name: (display_name || "").trim(),
        role: role || "viewer",
        permissions: permissions || {},
        status: status || "active",
      }).then(({ error }) => logError("save sub-account", error));
    }
  }, [userId, cases, team, charges, subAccounts, persistSnapshot]);

  const deleteSubAccount = useCallback((id) => {
    const nextSubAccounts = subAccounts.filter((m) => m.id !== id);
    setSubAccounts(nextSubAccounts);
    persistSnapshot(cases, team, charges, nextSubAccounts);
    if (userId) {
      supabase.from("lexcase_sub_accounts").delete().eq("id", id).eq("user_id", userId)
        .then(({ error }) => logError("delete sub-account", error));
    }
  }, [userId, cases, team, charges, subAccounts, persistSnapshot]);

  return {
    lang, toggleLang, loading, syncError,
    cases, upsertCase, bulkUpsertCases, deleteCase, addCaseDocument, deleteCaseDocument,
    team, upsertMember, createTeamMember, deleteMember,
    subAccounts, upsertSubAccount, deleteSubAccount,
    charges, addCharge,
  };
}
