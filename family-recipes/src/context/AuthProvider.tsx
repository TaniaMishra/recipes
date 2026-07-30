import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: { children: React.ReactNode; }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);

  const refreshUserProfile = async() => {
    if (!user) return;
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    if (profileError || !profile) setUserProfile(null);
    else setUserProfile(profile);
  }

  useEffect(() => {
    async function getSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !session.user) {
        setUser(null);
        setUserProfile(null);
      }
      else {
        setUser(session.user);
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        if (profileError || !profile) setUserProfile(null);
        else setUserProfile(profile);
      }
      setLoading(false);
    }

    getSession();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async(_event, session) => {
      const authUser = session?.user ?? null;
      setUser(authUser);
      if (!authUser) setUserProfile(null);
      else await refreshUserProfile();
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{
      user, loading, userProfile, refreshUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}