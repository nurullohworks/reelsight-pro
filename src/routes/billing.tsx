import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/components/app/AppShell";
import { StatCard } from "@/components/data/StatCard";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/app-store";

export const Route = createFileRoute("/billing")({
  head: () => ({
    meta: [
      { title: "Hisob-kitob — REELPREDICT" },
      { name: "description", content: "REELPREDICT tarifingiz, foydalanishingiz va yangilanishingizni boshqaring." },
      { property: "og:title", content: "Hisob-kitob — REELPREDICT" },
      { property: "og:description", content: "Joriy tarif, shu oydagi foydalanish va obuna boshqaruvi." },
    ],
  }),
  component: Billing,
});

function Billing() {
  const { subscription, setPlan, cancelSubscription } = useAppStore();
  const remaining = Math.max(0, subscription.monthlyLimit - subscription.usedThisMonth);

  return (
    <AppShell>
      <h1 className="text-3xl font-semibold">Hisob-kitob</h1>
      <p className="mt-2 text-muted-foreground">
        Obuna, foydalanish va hisob-fakturalar. To‘lov kalitlari ulanmaguncha to‘lov jarayoni simulyatsiya qilinadi.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Joriy tarif" value={subscription.plan.toUpperCase()} hint={subscription.billingCycle} />
        <StatCard label="Holat" value={subscription.status} />
        <StatCard
          label="Yangilanish sanasi"
          value={new Date(subscription.renewsAt).toLocaleDateString()}
        />
        <StatCard
          label="Shu oydagi foydalanish"
          value={`${subscription.usedThisMonth}/${subscription.monthlyLimit}`}
          hint={`${remaining} ta tahlil qoldi`}
        />
      </div>

      <div className="surface-card mt-6 p-6">
        <h2 className="text-sm uppercase tracking-widest text-muted-foreground">Tarifni boshqarish</h2>
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
              toast.success("Tarif yangilandi");
            }}
          >
            Tarifni oshirish
          </Button>
          <Button asChild variant="outline">
            <Link to="/pricing">Tarifni o‘zgartirish</Link>
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              cancelSubscription();
              toast("Obuna bekor qilindi", { description: "Kirish yangilanish sanasigacha saqlanadi." });
            }}
          >
            Obunani bekor qilish
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
