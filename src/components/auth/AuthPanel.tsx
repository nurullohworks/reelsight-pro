import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppStore } from "@/lib/app-store";

export function AuthPanel({ mode }: { mode: "login" | "signup" }) {
  const { signIn } = useAppStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Enter your email and password");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      signIn(email);
      setLoading(false);
      void navigate({ to: "/dashboard" });
    }, 500);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden border-r border-border bg-surface/60 p-12 lg:flex">
        <div className="halo pointer-events-none absolute inset-0" />
        <div className="grid-lines pointer-events-none absolute inset-0 opacity-25" />
        <Logo className="relative" />
        <div className="relative">
          <h2 className="max-w-sm text-4xl font-semibold leading-tight">Know before you post.</h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Prediction scores, timeline analysis and prioritized recommendations for every Reel —
            before it reaches your audience.
          </p>
        </div>
        <p className="relative text-xs text-muted-foreground">
          Predictions are estimates. REELPREDICT has no access to Meta's private ranking algorithm.
        </p>
      </div>

      <div className="flex items-center justify-center px-5 py-16">
        <div className="w-full max-w-sm">
          <div className="lg:hidden">
            <Logo />
          </div>
          <h1 className="mt-8 text-2xl font-semibold lg:mt-0">
            {mode === "login" ? "Log in" : "Create account"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "login"
              ? "Continue to your intelligence workspace."
              : "Start with 2 free analyses per month."}
          </p>

          <Button
            variant="outline"
            className="mt-7 w-full"
            onClick={() =>
              toast.info("Google sign-in becomes available once the backend is connected.")
            }
          >
            Continue with Google
          </Button>

          <div className="my-6 flex items-center gap-3 text-[11px] uppercase tracking-widest text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@studio.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in…" : mode === "login" ? "Login" : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-sm text-muted-foreground">
            {mode === "login" ? (
              <>
                No account?{" "}
                <Link to="/signup" className="text-primary hover:underline">
                  Create account
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Login
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
