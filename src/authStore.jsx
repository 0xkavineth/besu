import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { supabase } from "./supabaseClient";

// ---------------------------------------------
// Real auth backed by Supabase Auth + a `profiles` table (see
// supabase/schema.sql). Sessions are managed by supabase-js itself
// (stored in localStorage under the hood, refreshed automatically),
// so logging in on one device and then another with the same
// email/password now sees the same account and the same data —
// which is the whole point: this replaces the previous localStorage-
// only fake auth that couldn't sync across devices.
// ---------------------------------------------

function toSession(supaUser, profile) {
  if (!supaUser) return null;
  return {
    id: supaUser.id,
    name: profile?.name || supaUser.user_metadata?.name || "",
    email: supaUser.email,
    plan: profile?.plan || "free",
    provider: profile?.provider || "email",
    avatar: profile?.avatar || null,
    phone: profile?.phone || "",
    notifications: profile?.notifications !== false,
    lineLinked: !!profile?.line_linked,
  };
}

async function fetchProfile(userId) {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to load profile:", error.message);
    return null;
  }
  return data;
}

// Supabase's raw error messages are in English — map the common
// ones to the Thai copy the rest of the app already uses.
function translateAuthError(error) {
  const msg = error?.message || "";
  if (/invalid login credentials/i.test(msg)) return "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
  if (/already registered|user already exists/i.test(msg)) return "มีบัญชีที่ใช้อีเมลนี้อยู่แล้ว ลองเข้าสู่ระบบแทน";
  if (/email not confirmed/i.test(msg)) return "กรุณายืนยันอีเมลของคุณก่อนเข้าสู่ระบบ (ตรวจสอบกล่องข้อความอีเมล)";
  if (/password should be at least/i.test(msg)) return "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
  if (/rate limit|too many requests|email.*limit/i.test(msg)) {
    return "ส่งอีเมลยืนยันถูกจำกัดชั่วคราว กรุณาลองใหม่อีกครั้งใน 1–2 นาที";
  }
  return msg || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง";
}

const REDIRECT_STORAGE_KEY = "obfice_pending_redirect";

const readPendingRedirect = () => {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(REDIRECT_STORAGE_KEY) || null;
};

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [pendingRedirect, setPendingRedirect] = useState(() => readPendingRedirect());

  const loadSessionUser = useCallback(async (supaUser) => {
    if (!supaUser) {
      setUser(null);
      return;
    }
    const profile = await fetchProfile(supaUser.id);
    setUser(toSession(supaUser, profile));
  }, []);

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getSession().then(async ({ data }) => {
      if (cancelled) return;
      await loadSessionUser(data.session?.user || null);
      if (!cancelled) setInitializing(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      loadSessionUser(session?.user || null);
    });

    return () => {
      cancelled = true;
      subscription.subscription.unsubscribe();
    };
  }, [loadSessionUser]);

  const signup = useCallback(async ({ name, email, password, confirm }) => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanName) throw new Error("กรุณากรอกชื่อ-นามสกุล");
    if (!cleanEmail || !cleanEmail.includes("@")) throw new Error("กรุณากรอกอีเมลให้ถูกต้อง");
    if (password.length < 6) throw new Error("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
    if (confirm !== undefined && password !== confirm) throw new Error("รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน");

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: { data: { name: cleanName } },
    });
    if (error) throw new Error(translateAuthError(error));

    if (!data.user) return null;

    if (data.session) {
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: data.user.id,
        name: cleanName,
        avatar: null,
        phone: "",
        notifications: true,
        line_linked: false,
        plan: "free",
        provider: "email",
      }, { onConflict: "id" });
      if (profileError) {
        // eslint-disable-next-line no-console
        console.warn("Failed to sync profile row during signup:", profileError.message);
      }
    }

    // If email confirmation is required, there's no session yet —
    // still return a best-effort session object so the UI can show
    // a "check your email" style success state via the caller.
    const profile = await fetchProfile(data.user.id);
    const session = toSession(data.user, profile) || {
      id: data.user.id, name: cleanName, email: cleanEmail, plan: "free",
      provider: "email", avatar: null, phone: "", notifications: true, lineLinked: false,
    };
    if (data.session) setUser(session);
    return session;
  }, []);

  const login = useCallback(async ({ email, password }) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !password) throw new Error("กรุณากรอกอีเมลและรหัสผ่าน");
    const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
    if (error) throw new Error(translateAuthError(error));
    const profile = await fetchProfile(data.user.id);
    const session = toSession(data.user, profile);
    setUser(session);
    return session;
  }, []);

  // Google sign-in via Supabase's built-in OAuth provider. This
  // redirects the whole page to Google and back, so it only
  // resolves (with an error) if Supabase rejects the request before
  // the redirect — e.g. because the Google provider hasn't been
  // configured in the Supabase Dashboard yet.
  const loginWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) {
      throw new Error(
        "ยังไม่ได้เปิดใช้งาน Google Login ในโปรเจกต์ Supabase — ไปที่ Authentication > Providers > Google เพื่อตั้งค่าก่อน"
      );
    }
  }, []);

  // Supabase does not ship LINE as a built-in social provider —
  // it would need to be configured as a custom OIDC provider first.
  const loginWithLine = useCallback(async () => {
    throw new Error("การเข้าสู่ระบบด้วย Line ยังไม่เปิดให้ใช้งานสำหรับระบบนี้");
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  // Persists `patch` (plain object, camelCase keys matching the
  // session shape) onto the profiles row for the signed-in user.
  const patchCurrentUser = useCallback(async (patch) => {
    if (!user) return;
    const dbPatch = {};
    if (patch.name !== undefined) dbPatch.name = patch.name;
    if (patch.avatar !== undefined) dbPatch.avatar = patch.avatar;
    if (patch.phone !== undefined) dbPatch.phone = patch.phone;
    if (patch.notifications !== undefined) dbPatch.notifications = patch.notifications;
    if (patch.lineLinked !== undefined) dbPatch.line_linked = patch.lineLinked;
    if (patch.plan !== undefined) dbPatch.plan = patch.plan;

    const { error } = await supabase.from("profiles").update(dbPatch).eq("id", user.id);
    if (error) throw new Error("บันทึกข้อมูลไม่สำเร็จ: " + error.message);
    setUser((current) => (current ? { ...current, ...patch } : current));
  }, [user]);

  const updateProfile = useCallback(async ({ name, avatar } = {}) => {
    const patch = {};
    if (name !== undefined) {
      const cleanName = name.trim();
      if (!cleanName) throw new Error("กรุณากรอกชื่อ-นามสกุล");
      patch.name = cleanName;
    }
    if (avatar !== undefined) patch.avatar = avatar;
    await patchCurrentUser(patch);
  }, [patchCurrentUser]);

  const updatePhone = useCallback(async (phone) => {
    await patchCurrentUser({ phone: (phone || "").trim() });
  }, [patchCurrentUser]);

  const updateNotifications = useCallback(async (enabled) => {
    await patchCurrentUser({ notifications: !!enabled });
  }, [patchCurrentUser]);

  const linkLine = useCallback(async () => {
    throw new Error("การเชื่อมต่อบัญชี Line ยังไม่เปิดให้ใช้งานสำหรับระบบนี้");
  }, []);

  const unlinkLine = useCallback(async () => {
    await patchCurrentUser({ lineLinked: false });
  }, [patchCurrentUser]);

  const changePassword = useCallback(async ({ current, next, confirm }) => {
    if (!user) throw new Error("ไม่พบบัญชีผู้ใช้งาน");
    if (next.length < 6) throw new Error("รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร");
    if (next !== confirm) throw new Error("รหัสผ่านใหม่และการยืนยันไม่ตรงกัน");

    // Re-verify the current password by attempting a fresh sign-in
    // before allowing the change (Supabase's updateUser doesn't ask
    // for the old password itself).
    const { error: verifyError } = await supabase.auth.signInWithPassword({ email: user.email, password: current });
    if (verifyError) throw new Error("รหัสผ่านปัจจุบันไม่ถูกต้อง");

    const { error } = await supabase.auth.updateUser({ password: next });
    if (error) throw new Error("เปลี่ยนรหัสผ่านไม่สำเร็จ: " + error.message);
    return true;
  }, [user]);

  // Demo promo code: entering "luckydays" instantly upgrades the
  // account from Free to Pro (unlocks everything the ฿990 plan does).
  const redeemCode = useCallback(async (code) => {
    const clean = (code || "").trim().toLowerCase();
    if (!clean) throw new Error("กรุณากรอกโค้ด");
    if (clean !== "luckydays") throw new Error("โค้ดไม่ถูกต้องหรือหมดอายุแล้ว");
    if (user?.plan === "pro") return "already";
    await patchCurrentUser({ plan: "pro" });
    return "upgraded";
  }, [patchCurrentUser, user]);

  // Called when a guest tries to open an app — remembers where to send
  // them back to once they successfully log in / sign up.
  const requestLogin = useCallback((redirectTo) => {
    setPendingRedirect(redirectTo);
    if (typeof window !== "undefined") {
      if (redirectTo) window.sessionStorage.setItem(REDIRECT_STORAGE_KEY, redirectTo);
      else window.sessionStorage.removeItem(REDIRECT_STORAGE_KEY);
    }
  }, []);

  const consumeRedirect = useCallback(() => {
    const target = readPendingRedirect();
    setPendingRedirect(null);
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(REDIRECT_STORAGE_KEY);
    }
    return target;
  }, []);

  const value = {
    user, initializing, signup, login, loginWithGoogle, loginWithLine, logout, requestLogin, consumeRedirect, pendingRedirect,
    updateProfile, updatePhone, updateNotifications, linkLine, unlinkLine, changePassword, redeemCode,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}

export { AuthProvider, useAuth };
