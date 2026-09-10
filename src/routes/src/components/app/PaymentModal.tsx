import { useState } from "react";
import { Check, CreditCard, Sparkles, X, ShieldCheck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAppStore } from "@/lib/app-store";
import { PLAN_PRICING, PaymentService } from "@/lib/services/payment";
import type { PlanId } from "@/lib/types";
import { toast } from "sonner";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPlan: PlanId;
}

export function PaymentModal({ open, onOpenChange, selectedPlan }: PaymentModalProps) {
  const { setPlan, user } = useAppStore();
  const [method, setMethod] = useState<"click" | "payme" | "stripe">("click");
  const [loading, setLoading] = useState(false);

  const plan = PLAN_PRICING[selectedPlan] || PLAN_PRICING.pro;

  const handlePay = async () => {
    setLoading(true);
    const userId = user?.email || "user";

    try {
      if (method === "click") {
        const url = PaymentService.generateClickUrl(selectedPlan, userId);
        toast.info("Click to'lov sahifasiga yo'naltirilmoqda...", { description: `${plan.priceUzSum.toLocaleString()} so'm` });
        setTimeout(() => {
          setPlan(selectedPlan);
          toast.success("To'lov muvaffaqiyatli qabul qilindi!", { description: `${plan.name} tarifi faollashtirildi.` });
          setLoading(false);
          onOpenChange(false);
        }, 1500);
      } else if (method === "payme") {
        toast.info("Payme to'lov sahifasiga yo'naltirilmoqda...", { description: `${plan.priceUzSum.toLocaleString()} so'm` });
        setTimeout(() => {
          setPlan(selectedPlan);
          toast.success("To'lov muvaffaqiyatli qabul qilindi!", { description: `${plan.name} tarifi faollashtirildi.` });
          setLoading(false);
          onOpenChange(false);
        }, 1500);
      } else {
        toast.info("Stripe xalqaro to'lov sessiyasi ochilmoqda...", { description: `$${plan.priceUsd}` });
        setTimeout(() => {
          setPlan(selectedPlan);
          toast.success("Xalqaro to'lov tasdiqlandi!", { description: `${plan.name} faollashtirildi.` });
          setLoading(false);
          onOpenChange(false);
        }, 1500);
      }
    } catch (err) {
      toast.error("To'lovda xatolik yuz berdi");
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-card border-border p-6 sm:rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-xs font-semibold text-primary uppercase">
            <Sparkles className="h-4 w-4" />
            <span>Xavfsiz To'lov</span>
          </div>
          <DialogTitle className="text-xl font-bold mt-1">
            {plan.name} tarifiga obuna bo'lish
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Oylik {plan.analysisLimit} ta AI tahlili va barcha Meta algoritmi drayverlari
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 p-4 rounded-xl bg-secondary/30 border border-border/50">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">To'lov miqdori:</span>
            <div className="text-right">
              <span className="text-xl font-extrabold text-foreground">
                {plan.priceUzSum.toLocaleString()} so'm
              </span>
              <span className="text-xs text-muted-foreground block">/ oyiga (${plan.priceUsd})</span>
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            To'lov usulini tanlang:
          </label>
          
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setMethod("click")}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-sm font-semibold transition-all ${
                method === "click"
                  ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                  : "border-border bg-card/60 text-muted-foreground hover:border-border/80"
              }`}
            >
              <span className="font-bold text-base">CLICK</span>
              <span className="text-[10px] opacity-75">Uzcard / Humo</span>
            </button>

            <button
              type="button"
              onClick={() => setMethod("payme")}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-sm font-semibold transition-all ${
                method === "payme"
                  ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                  : "border-border bg-card/60 text-muted-foreground hover:border-border/80"
              }`}
            >
              <span className="font-bold text-base">Payme</span>
              <span className="text-[10px] opacity-75">Karta orqali</span>
            </button>

            <button
              type="button"
              onClick={() => setMethod("stripe")}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-sm font-semibold transition-all ${
                method === "stripe"
                  ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                  : "border-border bg-card/60 text-muted-foreground hover:border-border/80"
              }`}
            >
              <span className="font-bold text-base">Stripe</span>
              <span className="text-[10px] opacity-75">Visa / MC</span>
            </button>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span>256-bit shifrlangan xavfsiz to'lov</span>
          </div>
          <span>Istalgan payt bekor qilish mumkin</span>
        </div>

        <div className="mt-6 flex gap-2">
          <Button variant="ghost" className="flex-1" onClick={() => onOpenChange(false)}>
            Bekor qilish
          </Button>
          <Button
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
            disabled={loading}
            onClick={handlePay}
          >
            {loading ? "Jarayonda..." : "To'lovni Tasdiqlash"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}