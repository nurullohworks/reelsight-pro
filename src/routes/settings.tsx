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
      { title: "Settings — REELPREDICT" },
      { name: "description", content: "Profile, connected Instagram accounts, notifications and security." },
      { property: "og:title", content: "Settings — REELPREDICT" },
      { property: "og:description", content: "Manage your REELPREDICT workspace settings." },
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
      <h1 className="text-3xl font-semibold">Settings</h1>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Section title="Profile">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue={user?.name ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" defaultValue={user?.email ?? ""} />
          </div>
          <Button onClick={() => toast.success("Profile saved")}>Save changes</Button>
        </Section>

        <Section title="Connected Instagram accounts">
          <div className="flex items-center justify-between rounded-lg border border-border bg-background/40 p-4">
            <div>
              <p className="text-sm font-medium">@yourstudio</p>
              <p className="text-xs text-muted-foreground">
                Status: {instagramConnected ? "Connected" : "Not connected"}
              </p>
            </div>
            <Button variant={instagramConnected ? "outline" : "default"} onClick={toggleInstagram}>
              {instagramConnected ? "Disconnect" : "Connect Instagram Account"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Access tokens are stored server-side and are never exposed in the interface.
          </p>
        </Section>

        <Section title="Notifications">
          <Row label="Analysis completed" defaultChecked />
          <Row label="Weekly performance digest" defaultChecked />
          <Row label="Prediction accuracy updates" />
        </Section>

        <Section title="Subscription">
          <p className="text-sm text-muted-foreground">
            Current plan: <span className="text-foreground">{subscription.plan.toUpperCase()}</span> ·{" "}
            {subscription.usedThisMonth}/{subscription.monthlyLimit} analyses used
          </p>
          <Button asChild variant="outline">
            <Link to="/billing">Manage billing</Link>
          </Button>
        </Section>

        <Section title="Security">
          <div className="space-y-2">
            <Label htmlFor="pw">New password</Label>
            <Input id="pw" type="password" placeholder="••••••••" />
          </div>
          <Row label="Two-factor authentication" />
          <Button variant="outline" onClick={() => toast.success("Security settings updated")}>
            Update security
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
