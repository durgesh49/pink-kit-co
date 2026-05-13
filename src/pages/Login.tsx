import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Login = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(mode === "login" ? "Welcome back!" : "Account created 🎉");
    navigate("/");
  };

  return (
    <div className="min-h-[80vh] grid place-items-center px-4 py-16 bg-gradient-soft">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="font-display text-3xl font-semibold">webkit<span className="text-primary">.</span>store</Link>
          <h1 className="font-display text-3xl font-semibold mt-6">{mode === "login" ? "Welcome back" : "Join the club"}</h1>
          <p className="text-muted-foreground text-sm mt-2">
            {mode === "login" ? "Login to your account" : "Create an account to shop, wishlist & review"}
          </p>
        </div>

        <form onSubmit={submit} className="bg-card rounded-3xl p-7 shadow-card space-y-4">
          {mode === "signup" && (
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" required className="mt-1.5 rounded-xl h-11" />
            </div>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" required className="mt-1.5 rounded-xl h-11" placeholder="you@example.com" />
          </div>
          <div>
            <Label htmlFor="pw">Password</Label>
            <Input id="pw" type="password" required className="mt-1.5 rounded-xl h-11" placeholder="••••••••" />
          </div>
          <Button type="submit" size="lg" className="w-full rounded-full bg-gradient-primary hover:shadow-glow h-11">
            {mode === "login" ? "Login" : "Create account"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            {mode === "login" ? "New here? " : "Already have an account? "}
            <button type="button" onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-primary font-medium story-link">
              {mode === "login" ? "Sign up" : "Login"}
            </button>
          </p>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By continuing you agree to our <a href="#" className="story-link">Terms</a> & <a href="#" className="story-link">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
};

export default Login;
