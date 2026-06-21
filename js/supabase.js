// Supabase singleton + helpers
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
export const sb = createClient(window.SUPABASE_URL, window.SUPABASE_ANON, {
  auth: { persistSession: true, autoRefreshToken: true, storageKey: "suhrid-auth" }
});

export async function requireAuth(){
  const { data:{ session } } = await sb.auth.getSession();
  if (!session){ location.replace("index.html"); throw new Error("no session"); }
  return session;
}
export async function logout(){
  await sb.auth.signOut();
  location.replace("index.html");
}
