import { useEffect, useState } from "react";
import {
  LayoutDashboard, FolderKanban, Gavel, CalendarDays, Users, PieChart,
  ArrowLeft, Search, Bell, Languages, ChevronDown, LogOut,
  PanelLeftClose, PanelLeftOpen, WifiOff,
} from "lucide-react";
import { COLORS, GRADIENT_ORANGE } from "../../../theme";
import { useAuth } from "../../../authStore";
import { useThemeMode } from "../../../themeStore";
import ThemeToggle from "../../../components/ThemeToggle";
import { useLexCaseStore } from "./useLexCaseStore";
import { t } from "./constants";
import DashboardView from "./DashboardView";
import CasesView from "./CasesView";
import ExecutionView from "./ExecutionView";
import CalendarView from "./CalendarView";
import TeamView from "./TeamView";
import SummaryView from "./SummaryView";

const NAV_ITEMS = [
  { key: "dashboard", icon: LayoutDashboard, labelKey: "nav_dashboard" },
  { key: "cases", icon: FolderKanban, labelKey: "nav_cases" },
  { key: "execution", icon: Gavel, labelKey: "nav_execution" },
  { key: "calendar", icon: CalendarDays, labelKey: "nav_calendar" },
  { key: "team", icon: Users, labelKey: "nav_team" },
  { key: "summary", icon: PieChart, labelKey: "nav_summary" },
];

function initials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

const SIDEBAR_KEY = "lexcase_sidebar_collapsed";

// Decorative shooting-star / twinkle layer shown only in the "space" theme.
// Positions/delays are generated once so the animation doesn't reset on
// re-render, and the layer sits behind all content (pointer-events: none).
function SpaceStarfield() {
  const stars = [
    { top: "8%", left: "78%", delay: "0s", dur: "6s" },
    { top: "22%", left: "92%", delay: "2.4s", dur: "7.5s" },
    { top: "48%", left: "6%", delay: "4.6s", dur: "6.8s" },
    { top: "68%", left: "84%", delay: "1.2s", dur: "8s" },
    { top: "84%", left: "30%", delay: "5.5s", dur: "7s" },
  ];
  const twinkles = Array.from({ length: 22 }, (_, i) => ({
    top: `${(i * 37) % 100}%`,
    left: `${(i * 53) % 100}%`,
    size: 2 + (i % 3),
    delay: `${(i % 6) * 0.6}s`,
    dur: `${2.4 + (i % 4) * 0.6}s`,
  }));
  return (
    <div className="space-starfield" aria-hidden="true">
      {twinkles.map((s, i) => (
        <span
          key={`tw-${i}`}
          className="space-twinkle"
          style={{ top: s.top, left: s.left, width: s.size, height: s.size, animationDelay: s.delay, animationDuration: s.dur }}
        />
      ))}
      {stars.map((s, i) => (
        <span
          key={`star-${i}`}
          className="space-shooting-star"
          style={{ top: s.top, left: s.left, animationDelay: s.delay, animationDuration: s.dur }}
        />
      ))}
    </div>
  );
}

export default function LexCaseApp({ setPage }) {
  const { user, logout, requestLogin, initializing } = useAuth();
  const { mode } = useThemeMode();
  const store = useLexCaseStore(user?.id);
  const [view, setView] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem(SIDEBAR_KEY) === "1"; } catch { return false; }
  });
  const lang = store.lang;

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      const next = !c;
      try { localStorage.setItem(SIDEBAR_KEY, next ? "1" : "0"); } catch { /* ignore */ }
      return next;
    });
  };

  useEffect(() => {
    if (initializing) return; // wait for Supabase to report whether a session exists
    if (!user) {
      requestLogin("app-lexcase");
      setPage("login");
    }
  }, [user, initializing, requestLogin, setPage]);

  if (initializing) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: COLORS.bg, color: COLORS.textDim, fontSize: "0.9rem" }}>
        {t("loadingSession", lang || "th")}
      </div>
    );
  }

  if (!user) return null;

  const todayISO = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  })();
  const todaysCount = store.cases.reduce((acc, c) => acc + (c.appointments || []).filter((a) => a.date === todayISO).length, 0);

  const views = {
    dashboard: <DashboardView store={store} lang={lang} onOpenCalendar={() => setView("calendar")} />,
    cases: <CasesView store={store} lang={lang} searchQuery={search} />,
    execution: <ExecutionView store={store} lang={lang} />,
    calendar: <CalendarView store={store} lang={lang} />,
    team: <TeamView store={store} lang={lang} />,
    summary: <SummaryView store={store} lang={lang} />,
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: COLORS.bg, position: "relative" }}>
      {mode === "space" && <SpaceStarfield />}
      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 68 : 240, flexShrink: 0, borderRight: `1px solid ${COLORS.cardBorder}`, background: COLORS.navBg,
        display: "flex", flexDirection: "column", padding: collapsed ? "20px 10px" : "20px 14px", position: "sticky", top: 0, height: "100vh",
        transition: "width 200ms ease, padding 200ms ease", overflow: "hidden", zIndex: 1,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: collapsed ? "0 0 20px" : "0 8px 20px", justifyContent: collapsed ? "center" : "flex-start" }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: GRADIENT_ORANGE, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Gavel size={17} color="#fff" />
          </div>
          {!collapsed && (
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.05rem", whiteSpace: "nowrap" }}>{t("appName", lang)}</div>
          )}
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
          {NAV_ITEMS.map((item) => {
            const active = view === item.key;
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => setView(item.key)}
                title={collapsed ? t(item.labelKey, lang) : undefined}
                style={{
                  display: "flex", alignItems: "center", gap: 11, padding: collapsed ? "10px" : "10px 12px", borderRadius: 10, border: "none",
                  background: active ? COLORS.orangeSoft : "transparent", color: active ? COLORS.orangeDark : COLORS.text,
                  fontWeight: active ? 700 : 500, fontSize: "0.87rem", cursor: "pointer", textAlign: "left", width: "100%",
                  justifyContent: collapsed ? "center" : "flex-start",
                }}
              >
                <Icon size={17} style={{ flexShrink: 0 }} />
                {!collapsed && <span style={{ whiteSpace: "nowrap" }}>{t(item.labelKey, lang)}</span>}
              </button>
            );
          })}
        </nav>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, paddingTop: 12, borderTop: `1px solid ${COLORS.cardBorder}` }}>
          <button
            onClick={toggleCollapsed}
            title={collapsed ? t("expandSidebar", lang) : t("collapseSidebar", lang)}
            style={{
              display: "flex", alignItems: "center", gap: 10, padding: collapsed ? "9px" : "9px 12px", borderRadius: 10, border: "none",
              background: "transparent", color: COLORS.textDim, fontSize: "0.82rem", cursor: "pointer",
              justifyContent: collapsed ? "center" : "flex-start", width: "100%",
            }}
          >
            {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={15} />}
            {!collapsed && <span style={{ whiteSpace: "nowrap" }}>{t("collapseSidebar", lang)}</span>}
          </button>
          <button
            onClick={() => setPage("lexcase")}
            title={collapsed ? t("backToSite", lang) : undefined}
            style={{
              display: "flex", alignItems: "center", gap: 10, padding: collapsed ? "9px" : "9px 12px", borderRadius: 10, border: "none",
              background: "transparent", color: COLORS.textDim, fontSize: "0.82rem", cursor: "pointer",
              justifyContent: collapsed ? "center" : "flex-start", width: "100%",
            }}
          >
            <ArrowLeft size={15} style={{ flexShrink: 0 }} /> {!collapsed && <span style={{ whiteSpace: "nowrap" }}>{t("backToSite", lang)}</span>}
          </button>
        </div>
      </aside>

      {/* Main column */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, position: "relative", zIndex: 1 }}>
        {/* Top bar */}
        <header style={{
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "14px 24px",
          borderBottom: `1px solid ${COLORS.cardBorder}`, position: "sticky", top: 0, background: COLORS.bg, zIndex: 5,
        }}>
          <div style={{ flex: 1, maxWidth: 520, position: "relative" }}>
            <Search size={15} color={COLORS.textDim} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); if (e.target.value) setView("cases"); }}
              placeholder={t("searchPlaceholder", lang)}
              style={{
                width: "100%", padding: "10px 14px 10px 36px", borderRadius: 999, border: `1px solid ${COLORS.cardBorder}`,
                background: COLORS.card, color: COLORS.text, fontSize: "0.85rem", outline: "none",
              }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={store.toggleLang}
              title="EN / TH"
              style={{
                display: "flex", alignItems: "center", gap: 6, background: COLORS.cardAlt, border: `1px solid ${COLORS.cardBorder}`,
                borderRadius: 999, padding: "7px 12px", cursor: "pointer", color: COLORS.text, fontSize: "0.78rem", fontWeight: 700,
              }}
            >
              <Languages size={14} /> {lang === "th" ? "TH" : "EN"}
            </button>

            <ThemeToggle />

            <div style={{ position: "relative" }} onMouseEnter={() => setNotifOpen(true)} onMouseLeave={() => setNotifOpen(false)}>
              <button style={{ width: 36, height: 36, borderRadius: "50%", border: `1px solid ${COLORS.cardBorder}`, background: COLORS.cardAlt, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                <Bell size={16} color={COLORS.text} />
                {todaysCount > 0 && (
                  <span style={{ position: "absolute", top: 4, right: 5, width: 8, height: 8, borderRadius: "50%", background: "#ef4444" }} />
                )}
              </button>
              {notifOpen && (
                <div style={{ position: "absolute", right: 0, top: 42, width: 240, background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 12, boxShadow: "0 20px 40px -16px rgba(20,18,30,0.18)", padding: 12, zIndex: 20 }}>
                  <div style={{ fontSize: "0.8rem", fontWeight: 700, marginBottom: 6 }}>{t("notifications", lang)}</div>
                  <div style={{ fontSize: "0.78rem", color: COLORS.textDim }}>
                    {todaysCount > 0
                      ? `${t("todaysAppointments", lang)}: ${todaysCount}`
                      : t("noUpcoming", lang)}
                  </div>
                </div>
              )}
            </div>

            <div style={{ position: "relative" }} onMouseEnter={() => setProfileOpen(true)} onMouseLeave={() => setProfileOpen(false)}>
              <button style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "none", cursor: "pointer" }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: user?.avatar ? `center/cover no-repeat url(${user.avatar})` : GRADIENT_ORANGE,
                  color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700,
                }}>
                  {!user?.avatar && initials(user?.name)}
                </div>
                <ChevronDown size={13} color={COLORS.textDim} />
              </button>
              {profileOpen && (
                <div style={{ position: "absolute", right: 0, top: 42, width: 200, background: COLORS.card, border: `1px solid ${COLORS.cardBorder}`, borderRadius: 12, boxShadow: "0 20px 40px -16px rgba(20,18,30,0.18)", padding: 8, zIndex: 20 }}>
                  <div style={{ padding: "8px 10px", fontSize: "0.82rem", fontWeight: 700 }}>{user?.name}</div>
                  <button
                    onClick={() => setPage("settings")}
                    style={{ display: "flex", width: "100%", alignItems: "center", gap: 8, padding: "9px 10px", borderRadius: 8, fontSize: "0.82rem", color: COLORS.text, background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}
                  >
                    {t("profile", lang)}
                  </button>
                  <button
                    onClick={logout}
                    style={{ display: "flex", width: "100%", alignItems: "center", gap: 8, padding: "9px 10px", borderRadius: 8, fontSize: "0.82rem", color: "#ef4444", fontWeight: 600, background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}
                  >
                    <LogOut size={14} /> {t("logout", lang)}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main style={{ flex: 1, padding: "24px 28px" }}>
          {store.syncError && (
            <div style={{
              display: "flex", alignItems: "flex-start", gap: 10, background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.25)", color: "#b91c1c", borderRadius: 12,
              padding: "10px 14px", marginBottom: 18, fontSize: "0.82rem", lineHeight: 1.5,
            }}>
              <WifiOff size={16} style={{ flexShrink: 0, marginTop: 1 }} />
              <span>{t("syncErrorBanner", lang)}</span>
            </div>
          )}
          {views[view]}
        </main>
      </div>
    </div>
  );
}
