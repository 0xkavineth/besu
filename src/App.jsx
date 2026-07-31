import { useState } from "react";
import { COLORS } from "./theme";
import { AuthProvider } from "./authStore";
import { ThemeProvider } from "./themeStore";
import MotionStyles from "./components/MotionStyles";
import ScrollProgressBar from "./components/ScrollProgressBar";
import Nav from "./components/Nav";
import Footer from "./components/Footer";

import HomePage from "./pages/HomePage";
import AppsPage from "./pages/AppsPage";
import AccountingPage from "./pages/AccountingPage";
import LexCasePage from "./pages/LexCasePage";
import LexCaseApp from "./pages/apps/lexcase/LexCaseApp";
import TaxPlanPage from "./pages/TaxPlanPage";
import FinInsightPage from "./pages/FinInsightPage";
import PricingPage from "./pages/PricingPage";
import SecurityPage from "./pages/SecurityPage";
import ResourcesPage from "./pages/ResourcesPage";
import DownloadPage from "./pages/DownloadPage";
import ContactPage from "./pages/ContactPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";

// Pages that render their own full-screen app shell (sidebar, top bar)
// and should not be wrapped by the marketing site's Nav + Footer.
const FULLSCREEN_APP_PAGES = new Set(["app-lexcase"]);

export default function App() {
  const [page, setPage] = useState("home");
  const isFullscreenApp = FULLSCREEN_APP_PAGES.has(page);

  const PAGES = {
    home: <HomePage setPage={setPage} />,
    apps: <AppsPage setPage={setPage} />,
    accounting: <AccountingPage setPage={setPage} />,
    lexcase: <LexCasePage setPage={setPage} />,
    "app-lexcase": <LexCaseApp setPage={setPage} />,
    taxplan: <TaxPlanPage setPage={setPage} />,
    fininsight: <FinInsightPage setPage={setPage} />,
    pricing: <PricingPage setPage={setPage} />,
    security: <SecurityPage />,
    resources: <ResourcesPage />,
    download: <DownloadPage />,
    contact: <ContactPage />,
    signup: <SignupPage setPage={setPage} />,
    login: <LoginPage setPage={setPage} />,
    settings: <SettingsPage setPage={setPage} />,
  };

  return (
    <ThemeProvider>
      <AuthProvider>
        <div style={{ background: COLORS.bg, minHeight: "100vh", fontFamily: "'Inter', sans-serif", color: COLORS.text, position: "relative", overflow: "hidden", transition: "background-color 220ms ease, color 220ms ease" }}>
          <MotionStyles />
          {!isFullscreenApp && <ScrollProgressBar />}
          {!isFullscreenApp && <Nav page={page} setPage={setPage} />}
          <div key={page} className={isFullscreenApp ? undefined : "fade-up"}>
            {PAGES[page]}
          </div>
          {!isFullscreenApp && <Footer setPage={setPage} />}
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}
