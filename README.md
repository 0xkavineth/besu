# Obfice Base

Marketing site for Obfice Base — a suite of apps for accountants, lawyers, tax planners, and financial analysts.

## Run locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

## Build for production

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  main.jsx              entry point
  App.jsx                root component (page state + layout)
  theme.js                colors & gradients
  hooks.js                 useCountUp, useInView, useScrollY, useParallax
  data.js                    static content (apps, plans, FAQs, nav menus, etc.)
  components/
    MotionStyles.jsx        global CSS keyframes
    Patterns.jsx             decorative backgrounds (dot grid, aurora, blobs)
    ScrollProgressBar.jsx
    GoogleIcon.jsx
    Logo.jsx
    Nav.jsx / Footer.jsx / TrustMarquee.jsx
    ui.jsx                    shared buttons, cards, badges, page hero
    cards.jsx                 FAQItem, DownloadCard, PricingCard
    auth.jsx                  shared auth-page building blocks
    PillarsSection.jsx
    AppShowcaseSection.jsx
    AppProductPage.jsx        generic themed product-page builder
  pages/
    HomePage.jsx, AppsPage.jsx, LexCasePage.jsx, AccountingPage.jsx,
    TaxPlanPage.jsx, FinInsightPage.jsx, PricingPage.jsx, SecurityPage.jsx,
    ResourcesPage.jsx, DownloadPage.jsx, ContactPage.jsx,
    SignupPage.jsx, LoginPage.jsx
```

Navigation between "pages" is handled with simple React state in `App.jsx` (no router library).
