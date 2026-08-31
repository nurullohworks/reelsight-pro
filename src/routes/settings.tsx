import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAppStore } from "@/lib/app-store";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Sozlamalar — REELPREDICT" },
      { name: "description", content: "Profil, ulangan Instagram akkauntlari, bildirishnomalar va xavfsizlik." },
      { property: "og:title", content: "Sozlamalar — REELPREDICT" },
      { property: "og:description", content: "REELPREDICT ish maydoni sozlamalarini boshqaring." },
    ],
  }),
  component: Settings,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="surface-card p-6">
      <h2 className="text-sm uppercase tracking-widest text-muted-foreground">{title}</h2>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

function Settings() {
  const { user, subscription, instagramConnected, toggleInstagram } = useAppStore();

  return (
    <AppShell>
      <h1 className="text-3xl font-semibold">Sozlamalar</h1>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Section title="Profil">
          <div className="space-y-2">
            <Label htmlFor="name">Ism</Label>
            <Input id="name" defaultValue={user?.name ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" defaultValue={user?.email ?? ""} />
          </div>
          <Button onClick={() => toast.success("Profil saqlandi")}>O‘zgarishlarni saqlash</Button>
        </Section>

        <Section title="Ulangan Instagram akkauntlari">
          <div className="flex items-center justify-between rounded-lg border border-border bg-background/40 p-4">
            <div>
              <p className="text-sm font-medium">@yourstudio</p>
              <p className="text-xs text-muted-foreground">
                Holat: {instagramConnected ? "Ulangan" : "Ulanmagan"}
              </p>
            </div>
            <Button variant={instagramConnected ? "outline" : "default"} onClick={toggleInstagram}>
              {instagramConnected ? "Uzish" : "Instagram akkauntini ulash"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Kirish tokenlari server tomonida saqlanadi va interfeysda hech qachon ko‘rsatilmaydi.
          </p>
        </Section>

        <Section title="Bildirishnomalar">
          <Row label="Tahlil yakunlandi" defaultChecked />
          <Row label="Haftalik samaradorlik hisobotlari" defaultChecked />
          <Row label="Bashorat aniqligi yangilanishlari" />
        </Section>

        <Section title="Obuna">
          <p className="text-sm text-muted-foreground">
            Joriy tarif: <span className="text-foreground">{subscription.plan.toUpperCase()}</span> ·{" "}
            {subscription.usedThisMonth}/{subscription.monthlyLimit} ta tahlil ishlatilgan
          </p>
          <Button asChild variant="outline">
            <Link to="/billing">Hisob-kitobni boshqarish</Link>
          </Button>
        </Section>

        <Section title="Xavfsizlik">
          <div className="space-y-2">
            <Label htmlFor="pw">Yangi parol</Label>
            <Input id="pw" type="password" placeholder="••••••••" />
          </div>
          <Row label="Ikki bosqichli autentifikatsiya" />
          <Button variant="outline" onClick={() => toast.success("Xavfsizlik sozlamalari yangilandi")}>
            Xavfsizlikni yangilash
          </Button>
        </Section>
      </div>
    </AppShell>
  );
}

function Row({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-background/40 px-4 py-3">
      <span className="text-sm">{label}</span>
      <Switch defaultChecked={defaultChecked ?? false} />
    </div>
  );
}
