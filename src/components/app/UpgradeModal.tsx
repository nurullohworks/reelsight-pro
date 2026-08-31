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
        <DialogTitle className="text-xl">Oylik tahlil limitingizga yetdingiz.</DialogTitle>
        <DialogDescription className="text-sm leading-relaxed">
          Reels-larni tahlil qilishni davom ettirish va ilg'or samaradorlik tahlillarini ochish uchun
          tarifni yangilang.
        </DialogDescription>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Button
            className="flex-1"
            onClick={() => {
              setPlan("pro");
              onOpenChange(false);
            }}
          >
            Pro tarifiga o'tish
          </Button>
          <Button asChild variant="outline" className="flex-1">
            <Link to="/pricing">Tariflarni ko'rish</Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
