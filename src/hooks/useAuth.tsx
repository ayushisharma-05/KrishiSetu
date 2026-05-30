import { createContext, useContext, useEffect, useState, type ReactNode } from "react";


interface AuthCtx {
  user: any | null;
  loading: boolean;
  signIn: (userData: any) => void;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>({ user: null, loading: true, signIn: () => {}, signOut: async () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    
    if (token && storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        // data contains { token, user: {...} }, so extract user if it exists
        setUser(parsed.user || parsed);
      } catch(e) {
        // ignore
      }
    }
    
    setLoading(false);
  }, []);

  return (
    <Ctx.Provider value={{
      user,
      loading,
      signIn: (userData: any) => {
        setUser(userData.user || userData);
      },
      signOut: async () => { 
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      },
    }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);
