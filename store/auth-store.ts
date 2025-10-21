import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User, UserRole } from "@/types";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  checkSession: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  signInWithGoogle: () => Promise<void>;
  signInWithFacebook: () => Promise<void>;
  _setUserAndSession: (user: User | null, session: Session | null) => void;
}

const fetchUserProfile = async (userId: string): Promise<User | null> => {
  try {
    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error.message);
      return null;
    }
    return profile as User | null;
  } catch (e) {
    console.error("Exception fetching profile:", e);
    return null;
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isAuthenticated: false,
      isLoading: true,
      error: null,

      _setUserAndSession: (user, session) => {
         set({
           user,
           session,
           isAuthenticated: !!user && !!session,
           isLoading: false,
           error: null,
         });
      },

      checkSession: async () => {
        if (!get().isLoading) {
          set({ isLoading: true, error: null });
        }
        try {
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();

          if (sessionError) {
            console.error("Error getting session:", sessionError.message);
            get()._setUserAndSession(null, null);
            return;
          }

          if (session?.user) {
            const profile = await fetchUserProfile(session.user.id);
            if (profile) {
               get()._setUserAndSession(profile, session);
            } else {
               await get().logout();
            }
          } else {
             get()._setUserAndSession(null, null);
          }
        } catch (error) {
          console.error("Exception in checkSession:", error);
           get()._setUserAndSession(null, null);
        } finally {
           set({ isLoading: false });
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;

          if (data.user && data.session) {
             const profile = await fetchUserProfile(data.user.id);
             if (profile) {
                get()._setUserAndSession(profile, data.session);
             } else {
                 await get().logout();
                 throw new Error("Login succeeded but user profile could not be loaded.");
             }
          } else {
             throw new Error("Login response missing user or session data.");
          }
        } catch (error: any) {
           console.error("Login failed:", error.message);
           set({
             error: error.message || "Login failed. Please check your credentials.",
             isLoading: false,
             isAuthenticated: false,
             user: null,
             session: null,
           });
        }
      },

      register: async (userData, password) => {
        set({ isLoading: true, error: null });
        try {
          const { data: authData, error: signUpError } = await supabase.auth.signUp({
            email: userData.email!,
            password,
            options: {
              data: {
                name: userData.name,
                role: userData.role,
              }
            }
          });

          if (signUpError) throw signUpError;
          if (!authData.user || !authData.session) throw new Error("Registration response missing user or session data.");

          const profileData: Omit<User, 'id'> & { id: string } = {
              id: authData.user.id,
              name: userData.name || '',
              email: userData.email || '',
              phone: userData.phone || undefined,
              role: userData.role || 'citizen',
              avatarUrl: userData.avatarUrl,
              address: userData.address,
              department: userData.department,
              areaAssigned: userData.areaAssigned,
              registrationNumber: userData.registrationNumber,
              departmentId: userData.departmentId,
            };

          const { error: profileError } = await supabase
            .from('users')
            .insert(profileData);

          if (profileError) {
            throw new Error(`Registration succeeded but profile creation failed: ${profileError.message}`);
          }

          const finalProfile = await fetchUserProfile(authData.user.id);
          if (finalProfile) {
             get()._setUserAndSession(finalProfile, authData.session);
          } else {
              throw new Error("Registration and profile creation succeeded, but failed to fetch final profile.");
          }

        } catch (error: any) {
          console.error("Registration failed:", error.message);
          set({
            error: error.message || "Registration failed. Please try again.",
            isLoading: false,
            isAuthenticated: false,
            user: null,
            session: null,
          });
        }
      },

      signInWithGoogle: async () => {
        set({ isLoading: true, error: null });
        try {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
               redirectTo: `${process.env.EXPO_PUBLIC_APP_SCHEME}://auth/callback`,
            },
          });
          if (error) throw error;
        } catch (error: any) {
          console.error("Google sign-in initiation failed:", error.message);
          set({
            error: error.message || "Google sign-in failed.",
            isLoading: false,
          });
        }
      },

      signInWithFacebook: async () => {
         set({ isLoading: true, error: null });
        try {
          const { error } = await supabase.auth.signInWithOAuth({
            provider: 'facebook',
            options: {
               redirectTo: `${process.env.EXPO_PUBLIC_APP_SCHEME}://auth/callback`,
            },
          });
          if (error) throw error;
        } catch (error: any) {
          console.error("Facebook sign-in initiation failed:", error.message);
          set({
            error: error.message || "Facebook sign-in failed.",
            isLoading: false,
          });
        }
      },

      logout: async () => {
        if (!get().isLoading) {
           set({ isLoading: true });
        }
        try {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          get()._setUserAndSession(null, null);
        } catch (error: any) {
          console.error("Logout failed:", error.message);
          set({
            error: error.message || "Logout failed.",
            isLoading: false,
          });
        } finally {
           set(state => ({
             ...state,
             user: null,
             session: null,
             isAuthenticated: false,
             isLoading: false,
           }));
        }
      },

      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
       partialize: (state) => ({
         session: state.session,
       }),
       merge: (persistedState: any, currentState) => {
         const merged = { ...currentState, ...persistedState };
         setTimeout(() => {
           useAuthStore.getState().checkSession();
         }, 0);
         return merged;
       },
    }
  )
);

supabase.auth.onAuthStateChange(async (event, session) => {
  const { _setUserAndSession, logout, isLoading: storeIsLoading } = useAuthStore.getState();

  switch (event) {
    case 'INITIAL_SESSION':
      break;
    case 'SIGNED_IN':
      if (session?.user) {
         if (!storeIsLoading) {
            const profile = await fetchUserProfile(session.user.id);
            if (profile) {
                _setUserAndSession(profile, session);
            } else {
                await logout();
            }
         }
      } else {
          _setUserAndSession(null, null);
      }
      break;
    case 'SIGNED_OUT':
       _setUserAndSession(null, null);
      break;
    case 'PASSWORD_RECOVERY':
      break;
    case 'TOKEN_REFRESHED':
      if (session) {
        useAuthStore.setState({ session, isLoading: false });
      } else {
         _setUserAndSession(null, null);
      }
      break;
    case 'USER_UPDATED':
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id);
        if (profile) {
           useAuthStore.setState({ user: profile, session, isLoading: false });
        }
      }
      break;
    default:
      break;
  }
});