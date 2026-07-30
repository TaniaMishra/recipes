import { createContext } from "react";
import type { User } from "@supabase/supabase-js";

export type AuthContextType = {
  user: User | null;
  loading: boolean;
  userProfile: Profile | null;
  refreshUserProfile: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  userProfile: null,
  refreshUserProfile: async() => {}
});


