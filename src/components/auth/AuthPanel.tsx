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
      toast.error("Email va parolni kiriting");
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
          <h2 className="max-w-sm text-4xl font-semibold leading-tight">Joylashdan oldin biling.</h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Har bir Reels uchun bashorat ballari, vaqt jadvali tahlili va ustuvorlashtirilgan
            tavsiyalar — auditoriyangizga yetib borishidan oldin.
          </p>
        </div>
        <p className="relative text-xs text-muted-foreground">
          Bashoratlar taxminiy hisoblanadi. REELPREDICT Meta'ning maxfiy reyting algoritmiga kirish huquqiga ega emas.
        </p>
      </div>

      <div className="flex items-center justify-center px-5 py-16">
        <div className="w-full max-w-sm">
          <div className="lg:hidden">
            <Logo />
          </div>
          <h1 className="mt-8 text-2xl font-semibold lg:mt-0">
            {mode === "login" ? "Kirish" : "Hisob yaratish"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "login"
              ? "Intellekt ish maydoningizga davom eting."
              : "Oyiga 2 ta bepul tahlil bilan boshlang."}
          </p>

          <Button
            variant="outline"
            className="mt-7 w-full"
            onClick={() =>
              toast.info("Google orqali kirish backend ulangandan so'ng mavjud bo'ladi.")
            }
          >
            Google bilan davom etish
          </Button>

          <div className="my-6 flex items-center gap-3 text-[11px] uppercase tracking-widest text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> yoki <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="siz@studio.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Parol</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Kirilmoqda…" : mode === "login" ? "Kirish" : "Hisob yaratish"}
            </Button>
          </form>

          <p className="mt-6 text-sm text-muted-foreground">
            {mode === "login" ? (
              <>
                Hisobingiz yo'qmi?{" "}
                <Link to="/signup" className="text-primary hover:underline">
                  Hisob yaratish
                </Link>
              </>
            ) : (
              <>
                Hisobingiz bormi?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Kirish
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
