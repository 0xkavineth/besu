import { createClient } from "@supabase/supabase-js";

// ---------------------------------------------
// Single shared Supabase client. Uses the *publishable* key only —
// this is safe to ship in client-side code (it's subject to Row Level
// Security policies on every table). Never put a secret/service_role
// key here.
// ---------------------------------------------
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  // Fails loudly at startup rather than silently falling back to
  // localStorage-only behaviour, since that was the original bug.
  // eslint-disable-next-line no-console
  console.error(
    "Missing VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY. Add them to a .env file (see .env.example) and restart the dev server."
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
