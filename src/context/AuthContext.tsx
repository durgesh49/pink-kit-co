import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "@/supabase";

interface AuthContextType {
  user: any;
  loading: boolean;

  signUp: (
    email: string,
    password: string
  ) => Promise<any>;

  signIn: (
    email: string,
    password: string
  ) => Promise<any>;

  logout: () => Promise<void>;

  isAdmin: boolean;
}

const AuthContext =
  createContext<AuthContextType>(
    {} as AuthContextType
  );

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => {
        setUser(data.session?.user ?? null);
        setLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () =>
      subscription.unsubscribe();
  }, []);

  const signUp = async (
    email: string,
    password: string
  ) => {
    return await supabase.auth.signUp({
      email,
      password,
    });
  };

  const signIn = async (
    email: string,
    password: string
  ) => {
    return await supabase.auth.signInWithPassword(
      {
        email,
        password,
      }
    );
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const isAdmin =
    user?.email ===
    "durgexh11@gmail.com";

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        logout,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);