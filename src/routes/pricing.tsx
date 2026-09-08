import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/app-store";
import type { PlanId } from "@/lib/types";
import { cn } from "@/lib/utils";
import { PaymentModal } from "@/components/app/PaymentModal";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Narxlar вЂ” REELPREDICT" },
      {
        name: "description",
        content:
          "Instagram samaradorlik tahlili uchun qulay narxlar: Bepul, Pro вЂ” 190,000 so'm/oy va Agency вЂ” 490,000 so'm/oy.",
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
  monthlyUzSum: number;
  monthlyUsd: number;
  features: string[];
  cta: string;
  popular?: boolean;
}[] = [
  {
    id: "free",
    name: "Bepul",
    monthlyUzSum: 0,
    monthlyUsd: 0,
    cta: "Bepul Boshlash",
    features: ["Oyiga 2 ta tahlil", "Asosiy hisobot", "Asosiy hisob tahlili", "Cheklangan tarix"],
  },
  {
    id: "pro",
    name: "Pro Yaratuvchi",
    monthlyUzSum: 190000,
    monthlyUsd: 15,
    cta: "Pro'ga O'tish",
    popular: true,
    features: [
      "100 ta video tahlili",
      "Ilg'or Gemini / Claude AI tahlili",
      "Meta 5 drayverli diagnostika",
      "LiveDune sohaviy benchmarklari",
      "Batafsil timeline tavsiyalari",
      "Tahlil tarixi va solishtirish",
      "Ustuvor qayta ishlash",
    ],
  },
  {
    id: "agency",
    name: "Agency & SMM",
    monthlyUzSum: 490000,
    monthlyUsd: 39,
    cta: "Agency'ni Boshlash",
    features: [
      "500 ta video tahlili",
      "Bir nechta Instagram hisoblari",
      "Jamoaviy kirish imkoniyati",
      "Mijozlar uchun PDF hisobotlar",
      "Oq nishonli (White-label) brending",
      "VIP texnik yordam",
    ],
  },
];

function Pricing() {
  const [yearly, setYearly] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("pro");
  const { user, setPlan } = useAppStore();
  const navigate = useNavigate();

  const choose = (id: PlanId) => {
    if (id === "free") {
      setPlan("free");
      void navigate({ to: "/billing" });
      return;
    }
    setSelectedPlan(id);
    setPaymentOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="border-b border-border py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="text-center">
            <h1 className="text-4xl font-semibold md:text-5xl">Natija uchun mo'ljallangan narxlar.</h1>
            <p className="mt-4 text-sm text-muted-foreground">
              Har bir tarif to'liq bashorat tizimini o'z ichiga oladi. Click, Payme va xalqaro kartalar orqali to'lov qiling.
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
                Yillik В· 20% tejang
              </button>
            </div>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => {
              const priceSum = yearly ? Math.round(plan.monthlyUzSum * 0.8) : plan.monthlyUzSum;
              const priceUsd = yearly ? Math.round(plan.monthlyUsd * 0.8) : plan.monthlyUsd;
              return (
                <div
                  key={plan.id}
                  className={cn(
                    "surface-card relative flex flex-col p-7",
                    plan.popular && "border-primary/50 shadow-[var(--shadow-glow)]",
                  )}
                >
                  {plan.popular ? (
                    <span className="absolute -top-3 left-7 rounded-full bg-primary px-3 py-1 text-[10px] uppercase tracking-widest text-primary-foreground font-bold">
                      Eng ommabop
                    </span>
                  ) : null}
                  <h2 className="text-sm uppercase tracking-widest text-muted-foreground font-semibold">
                    {plan.name}
                  </h2>
                  <div className="mt-4 flex flex-col">
                    {plan.id === "free" ? (
                      <span className="text-4xl font-bold">Bepul</span>
                    ) : (
                      <>
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-extrabold">{priceSum.toLocaleString()} so'm</span>
                          <span className="text-xs text-muted-foreground">/oy</span>
                        </div>
                        <span className="text-xs text-muted-foreground mt-0.5">yoki ${priceUsd}/oy</span>
                      </>
                    )}
                  </div>
                  {yearly && plan.monthlyUzSum > 0 ? (
                    <p className="mt-1 text-xs text-primary">
                      Yillik to'lovda 20% chegirma beriladi
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
                    className="mt-7 font-bold"
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
            Bashoratlar Meta algoritmining 5 ta drayveri va LiveDune benchmarklari asosida beriladi.
            To'lovlar Click, Payme va Stripe orqali to'liq himoyalangan.
          </p>
        </div>
      </section>
      <SiteFooter />

      <PaymentModal
        open={paymentOpen}
        onOpenChange={setPaymentOpen}
        selectedPlan={selectedPlan}
      />
    </div>
  );
}