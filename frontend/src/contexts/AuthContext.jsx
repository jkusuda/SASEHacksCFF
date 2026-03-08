import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../supabase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Web pages don't have chrome.storage; Extension popups do!
  const isExtensionContext = typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local;

  useEffect(() => {
    const initializeAuth = async () => {
      if (isExtensionContext) {
        // --- EXTENSION POPUP CONTEXT ---
        // Strictly read from chrome.storage.local synced from the webpage
        chrome.storage.local.get(['supabaseSession'], (result) => {
          setUser(result.supabaseSession?.user ?? null);
          setLoading(false);
          // Optional: Hydrate local supabase client just in case
          if (result.supabaseSession) {
            supabase.auth.setSession(result.supabaseSession);
          }
        });

        // Listen for storage changes in real-time
        chrome.storage.onChanged.addListener((changes, namespace) => {
          if (namespace === 'local' && changes.supabaseSession) {
            setUser(changes.supabaseSession.newValue?.user ?? null);
          }
        });
      } else {
        // --- WEB BROWSER CONTEXT ---
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        if (session) {
          window.postMessage({ type: 'SYNC_SUPABASE_SESSION', session: session }, '*');
        }
        setLoading(false);
      }
    };

    initializeAuth();

    // The website acts as the source of truth for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!isExtensionContext) {
        setUser(session?.user ?? null);
        setLoading(false);
        window.postMessage({ type: 'SYNC_SUPABASE_SESSION', session: session || null }, '*');
      }
    });

    return () => subscription.unsubscribe();
  }, [])

  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  const signUp = async (email, password) => {
    const { error } = await supabase.auth.signUp({ email, password })
    return { error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (!isExtensionContext) {
      window.postMessage({ type: 'SYNC_SUPABASE_SESSION', session: null }, '*');
    }
    return { error }
  }

  const getToken = async () => {
    if (isExtensionContext) {
      return new Promise((resolve) => {
        chrome.storage.local.get(['supabaseSession'], (result) => {
          resolve(result.supabaseSession?.access_token || null);
        });
      });
    }

    const { data } = await supabase.auth.getSession()
    return data?.session?.access_token
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    getToken,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
