import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Sparkles } from "lucide-react";
import { useAppStore } from "@/lib/app-store";

export function UpgradeModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { setPlan } = useAppStore();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-border bg-popover">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <DialogTitle className="text-xl">You've reached your monthly analysis limit.</DialogTitle>
        <DialogDescription className="text-sm leading-relaxed">
          Upgrade to continue analyzing Reels and unlock advanced performance intelligence.
        </DialogDescription>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Button
            className="flex-1"
            onClick={() => {
              setPlan("pro");
              onOpenChange(false);
            }}
          >
            Upgrade to Pro
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link to="/pricing">View Plans</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
