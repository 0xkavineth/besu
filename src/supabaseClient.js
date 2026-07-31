import { createClient } from "@supabase/supabase-js";

// ---------------------------------------------
// Single shared Supabase client. Uses the *publishable* key only —
// this is safe to ship in client-side code (it's subject to Row Level
// Security policies on every table). Never put a secret/service_role
// key here.
//
// IMPORTANT: createClient() throws synchronously if the URL is
// missing/invalid. Since this module is imported at the very top of
// the app (authStore -> App -> main.jsx), an uncaught throw here
// blanks out the *entire* page with nothing but a console error —
// no React tree ever mounts. So this file never lets that happen:
// if config is missing, it falls back to a valid dummy URL and every
// real Supabase call will fail with a clear, catchable error instead
// of crashing the whole app at load time.
// ---------------------------------------------
const rawUrl = import.meta.env.VITE_SUPABASE_URL;
const rawKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

function isValidUrl(value) {
  try {
    // eslint-disable-next-line no-new
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export const supabaseConfigured = !!rawUrl && !!rawKey && isValidUrl(rawUrl);

if (!supabaseConfigured) {
  // eslint-disable-next-line no-console
  console.error(
    "[supabaseClient] Missing or invalid VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY.\n" +
    "Add both to a .env file at the project root (see .env.example), then restart `npm run dev`\n" +
    "(Vite only reads .env at server start — editing it while the dev server is running won't apply)."
  );
}

export const supabase = createClient(
  supabaseConfigured ? rawUrl : "https://placeholder.supabase.co",
  supabaseConfigured ? rawKey : "placeholder-key"
);

