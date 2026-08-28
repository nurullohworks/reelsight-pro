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
      { title: "Pricing — REELPREDICT" },
      {
        name: "description",
        content:
          "Simple pricing for Instagram performance intelligence: Free, Pro at $29/month and Agency at $79/month with team access and white-label reports.",
      },
      { property: "og:title", content: "REELPREDICT Pricing" },
      {
        property: "og:description",
        content: "Free, Pro and Agency plans for AI-powered Reels performance prediction.",
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
    name: "Free",
    monthly: 0,
    cta: "Start Free",
    features: ["2 analyses / month", "Basic report", "Basic account analysis", "Limited history"],
  },
  {
    id: "pro",
    name: "Pro",
    monthly: 29,
    cta: "Upgrade to Pro",
    popular: true,
    features: [
      "100 video analyses",
      "Advanced AI analysis",
      "Account intelligence",
      "Performance prediction",
      "Detailed recommendations",
      "Analysis history",
      "Prediction tracking",
      "Priority processing",
    ],
  },
  {
    id: "agency",
    name: "Agency",
    monthly: 79,
    cta: "Start Agency",
    features: [
      "Multiple Instagram accounts",
      "High analysis limits",
      "Team access",
      "Client reports",
      "White-label reports",
      "Advanced analytics",
      "Priority processing",
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
    toast.success(`${id === "free" ? "Free" : id === "pro" ? "Pro" : "Agency"} plan activated`, {
      description: "Checkout is simulated in this prototype until Stripe keys are connected.",
    });
    void navigate({ to: "/billing" });
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="border-b border-border py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="text-center">
            <h1 className="text-4xl font-semibold md:text-5xl">Pricing built for output.</h1>
            <p className="mt-4 text-sm text-muted-foreground">
              Every plan includes the full prediction engine. Volume and collaboration scale up.
            </p>
            <div className="mt-8 inline-flex items-center gap-1 rounded-full border border-border bg-surface p-1 text-sm">
              <button
                onClick={() => setYearly(false)}
                className={cn(
                  "rounded-full px-4 py-1.5 transition-colors",
                  !yearly ? "bg-muted text-foreground" : "text-muted-foreground",
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setYearly(true)}
                className={cn(
                  "rounded-full px-4 py-1.5 transition-colors",
                  yearly ? "bg-muted text-foreground" : "text-muted-foreground",
                )}
              >
                Yearly · save 20%
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
                      Most popular
                    </span>
                  ) : null}
                  <h2 className="text-sm uppercase tracking-widest text-muted-foreground">
                    {plan.name}
                  </h2>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-semibold">${price}</span>
                    <span className="text-sm text-muted-foreground">/month</span>
                  </div>
                  {yearly && plan.monthly > 0 ? (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Billed ${price * 12} yearly
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
            Predictions are estimates based on available data and historical performance signals.
            Actual results may vary.
          </p>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
