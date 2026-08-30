import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/components/app/AppShell";
import { StatCard } from "@/components/data/StatCard";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/app-store";

export const Route = createFileRoute("/billing")({
  head: () => ({
    meta: [
      { title: "Billing — REELPREDICT" },
      { name: "description", content: "Manage your REELPREDICT plan, usage and renewal." },
      { property: "og:title", content: "Billing — REELPREDICT" },
      { property: "og:description", content: "Current plan, usage this month and subscription controls." },
    ],
  }),
  component: Billing,
});

function Billing() {
  const { subscription, setPlan, cancelSubscription } = useAppStore();
  const remaining = Math.max(0, subscription.monthlyLimit - subscription.usedThisMonth);

  return (
    <AppShell>
      <h1 className="text-3xl font-semibold">Billing</h1>
      <p className="mt-2 text-muted-foreground">
        Subscription, usage and invoices. Checkout is simulated until payment keys are connected.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Current plan" value={subscription.plan.toUpperCase()} hint={subscription.billingCycle} />
        <StatCard label="Status" value={subscription.status} />
        <StatCard
          label="Renewal date"
          value={new Date(subscription.renewsAt).toLocaleDateString()}
        />
        <StatCard
          label="Usage this month"
          value={`${subscription.usedThisMonth}/${subscription.monthlyLimit}`}
          hint={`${remaining} analyses remaining`}
        />
      </div>

      <div className="surface-card mt-6 p-6">
        <h2 className="text-sm uppercase tracking-widest text-muted-foreground">Manage plan</h2>
        <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary"
            style={{
              width: `${Math.min(100, (subscription.usedThisMonth / subscription.monthlyLimit) * 100)}%`,
            }}
          />
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button
            onClick={() => {
              setPlan(subscription.plan === "agency" ? "agency" : "pro");
              toast.success("Plan upgraded");
            }}
          >
            Upgrade
          </Button>
          <Button asChild variant="outline">
            <Link to="/pricing">Change plan</Link>
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              cancelSubscription();
              toast("Subscription canceled", { description: "Access remains until renewal date." });
            }}
          >
            Cancel subscription
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
