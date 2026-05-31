import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { syncUserLanguage } from "@/lib/i18n";
import type { Session, User } from "@supabase/supabase-js";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const { data: sub } = supabase.auth.onAuthStateChange(async (_evt, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      // Sync language when auth state changes
      await syncUserLanguage(s?.user ?? null);
    });
    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      // Sync language on initial load
      await syncUserLanguage(data.session?.user ?? null);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return { session, user, loading };
}
