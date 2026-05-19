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

  // SESSION CHECK
  useEffect(() => {

    const checkUser =
      async () => {

        const {
          data: { session },
        } =
          await supabase.auth.getSession();

        // ONLY VERIFIED USERS
        if (
          session?.user
            ?.email_confirmed_at
        ) {

          setUser(session.user);

        } else {

          setUser(null);

          await supabase.auth.signOut();

        }

        setLoading(false);
      };

    checkUser();

    // LIVE AUTH CHANGES
    const {
      data: { subscription },
    } =
      supabase.auth.onAuthStateChange(
        async (
          _event,
          session
        ) => {

          if (
            session?.user
              ?.email_confirmed_at
          ) {

            setUser(
              session.user
            );

          } else {

            setUser(null);

          }
        }
      );

    return () =>
      subscription.unsubscribe();

  }, []);

  // SIGNUP
  const signUp = async (
    email: string,
    password: string
  ) => {

    return await supabase.auth.signUp(
      {
        email,
        password,
      }
    );
  };

  // LOGIN
  const signIn = async (
    email: string,
    password: string
  ) => {

    const response =
      await supabase.auth.signInWithPassword(
        {
          email,
          password,
        }
      );

    // BLOCK UNVERIFIED USERS
    if (
      response.data.user &&
      !response.data.user
        .email_confirmed_at
    ) {

      await supabase.auth.signOut();

      return {
        data: null,
        error: {
          message:
            "Please verify your email first ❤️",
        },
      };
    }

    return response;
  };

  // LOGOUT
  const logout = async () => {

    await supabase.auth.signOut();

    setUser(null);
  };

  // ADMIN
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