import { useState } from "react";
import { supabase } from "@/supabase";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const [mode, setMode] =
    useState<"login" | "signup">(
      "login"
    );

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [name, setName] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const navigate = useNavigate();

  const {
    signIn,
    signUp,
  } = useAuth();

  const submit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setLoading(true);

    try {
      // SIGNUP
      if (mode === "signup") {
        const { error } =
          await signUp(
            email,
            password
          );

        if (error)
          throw error;

        toast.success(
          "Account created 🎉"
        );

        // AUTO LOGOUT AFTER SIGNUP
        await supabase.auth.signOut();

        toast.success(
          "Please verify your email before login ❤️"
        );

        setLoading(false);

        return;
      }

      // LOGIN
      const { error } =
        await signIn(
          email,
          password
        );

      if (error)
        throw error;

      toast.success(
        "Welcome back 🔥"
      );

      navigate("/");
    } catch (err: any) {
      toast.error(
        err.message ||
          "Something went wrong"
      );
    }

    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] grid place-items-center px-4 py-16 bg-gradient-soft">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <Link
            to="/"
            className="font-display text-3xl font-semibold"
          >
            webkit
            <span className="text-primary">
              .
            </span>
            store
          </Link>

          <h1 className="font-display text-3xl font-semibold mt-6">
            {mode === "login"
              ? "Welcome back"
              : "Create account"}
          </h1>

          <p className="text-muted-foreground text-sm mt-2">
            {mode === "login"
              ? "Login to continue"
              : "Create your new account"}
          </p>
        </div>

        <form
          onSubmit={submit}
          className="bg-card rounded-3xl p-7 shadow-card space-y-4"
        >

          {mode === "signup" && (
            <div>
              <Label htmlFor="name">
                Name
              </Label>

              <Input
                id="name"
                value={name}
                onChange={(e) =>
                  setName(
                    e.target.value
                  )
                }
                required
                className="mt-1.5 rounded-xl h-11"
              />
            </div>
          )}

          <div>
            <Label htmlFor="email">
              Email
            </Label>

            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              className="mt-1.5 rounded-xl h-11"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <Label htmlFor="pw">
              Password
            </Label>

            <Input
              id="pw"
              type="password"
              required
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className="mt-1.5 rounded-xl h-11"
              placeholder="••••••••"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className="w-full rounded-full bg-gradient-primary hover:shadow-glow h-11"
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Login"
              : "Create account"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {mode === "login"
              ? "New here? "
              : "Already have an account? "}

            <button
              type="button"
              onClick={() =>
                setMode(
                  mode === "login"
                    ? "signup"
                    : "login"
                )
              }
              className="text-primary font-medium story-link"
            >
              {mode === "login"
                ? "Sign up"
                : "Login"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;