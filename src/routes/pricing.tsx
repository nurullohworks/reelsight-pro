import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/app-store";
import type { PlanId } from "@/lib/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Narxlar — REELPREDICT" },
      {
        name: "description",
        content:
          "Instagram samaradorlik tahlili uchun oddiy narxlar: Bepul, Pro — $29/oy va Agency — $79/oy, jamoaviy kirish va oq nishonli hisobotlar bilan.",
      },
      { property: "og:title", content: "REELPREDICT Narxlari" },
      {
        property: "og:description",
        content: "AI asosidagi Reels samaradorligini bashorat qilish uchun Bepul, Pro va Agency tariflari.",
      },
    ],
  }),
  component: Pricing,
});

const plans: {
  id: PlanId;
  name: string;
  monthly: number;
  features: string[];
  cta: string;
  popular?: boolean;
}[] = [
  {
    id: "free",
    name: "Bepul",
    monthly: 0,
    cta: "Bepul Boshlash",
    features: ["Oyiga 2 ta tahlil", "Asosiy hisobot", "Asosiy hisob tahlili", "Cheklangan tarix"],
  },
  {
    id: "pro",
    name: "Pro",
    monthly: 29,
    cta: "Pro'ga O'tish",
    popular: true,
    features: [
      "100 ta video tahlili",
      "Ilg'or AI tahlili",
      "Hisob intellekti",
      "Samaradorlik bashorati",
      "Batafsil tavsiyalar",
      "Tahlil tarixi",
      "Bashorat kuzatuvi",
      "Ustuvor qayta ishlash",
    ],
  },
  {
    id: "agency",
    name: "Agency",
    monthly: 79,
    cta: "Agency'ni Boshlash",
    features: [
      "Bir nechta Instagram hisoblari",
      "Yuqori tahlil chegaralari",
      "Jamoaviy kirish",
      "Mijoz hisobotlari",
      "Oq nishonli hisobotlar",
      "Ilg'or tahlillar",
      "Ustuvor qayta ishlash",
    ],
  },
];

function Pricing() {
  const [yearly, setYearly] = useState(false);
  const { setPlan, user } = useAppStore();
  const navigate = useNavigate();

  const choose = (id: PlanId) => {
    if (!user) {
      void navigate({ to: "/signup" });
      return;
    }
    setPlan(id, yearly ? "yearly" : "monthly");
    toast.success(`${id === "free" ? "Bepul" : id === "pro" ? "Pro" : "Agency"} tarifi faollashtirildi`, {
      description: "Stripe kalitlari ulanguncha to'lov ushbu prototipda simulyatsiya qilinadi.",
    });
    void navigate({ to: "/billing" });
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="border-b border-border py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="text-center">
            <h1 className="text-4xl font-semibold md:text-5xl">Natija uchun mo'ljallangan narxlar.</h1>
            <p className="mt-4 text-sm text-muted-foreground">
              Har bir tarif to'liq bashorat tizimini o'z ichiga oladi. Hajm va hamkorlik kengaytiriladi.
            </p>
            <div className="mt-8 inline-flex items-center gap-1 rounded-full border border-border bg-surface p-1 text-sm">
              <button
                onClick={() => setYearly(false)}
                className={cn(
                  "rounded-full px-4 py-1.5 transition-colors",
                  !yearly ? "bg-muted text-foreground" : "text-muted-foreground",
                )}
              >
                Oylik
              </button>
              <button
                onClick={() => setYearly(true)}
                className={cn(
                  "rounded-full px-4 py-1.5 transition-colors",
                  yearly ? "bg-muted text-foreground" : "text-muted-foreground",
                )}
              >
                Yillik · 20% tejang
              </button>
            </div>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => {
              const price = yearly ? Math.round(plan.monthly * 0.8) : plan.monthly;
              return (
                <div
                  key={plan.id}
                  className={cn(
                    "surface-card relative flex flex-col p-7",
                    plan.popular && "border-primary/50 shadow-[var(--shadow-glow)]",
                  )}
                >
                  {plan.popular ? (
                    <span className="absolute -top-3 left-7 rounded-full bg-primary px-3 py-1 text-[10px] uppercase tracking-widest text-primary-foreground">
                      Eng ommabop
                    </span>
                  ) : null}
                  <h2 className="text-sm uppercase tracking-widest text-muted-foreground">
                    {plan.name}
                  </h2>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-semibold">${price}</span>
                    <span className="text-sm text-muted-foreground">/oy</span>
                  </div>
                  {yearly && plan.monthly > 0 ? (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Yiliga ${price * 12} hisoblanadi
                    </p>
                  ) : null}
                  <ul className="mt-6 flex-1 space-y-3 text-sm">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-foreground/85">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="mt-7"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => choose(plan.id)}
                  >
                    {plan.cta}
                  </Button>
                </div>
              );
            })}
          </div>
          <p className="mt-8 text-center text-xs text-muted-foreground">
            Bashoratlar mavjud ma'lumotlar va tarixiy samaradorlik signallari asosidagi taxminlardir.
            Haqiqiy natijalar farq qilishi mumkin.
          </p>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
