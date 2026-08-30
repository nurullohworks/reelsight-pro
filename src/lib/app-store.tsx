import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { seedAnalyses } from "./mock-data";
import type { Analysis, PlanId, Subscription } from "./types";

export interface AppUser {
  name: string;
  email: string;
}

export const PLAN_LIMITS: Record<PlanId, number> = { free: 2, pro: 100, agency: 500 };

interface AppState {
  user: AppUser | null;
  analyses: Analysis[];
  subscription: Subscription;
  instagramConnected: boolean;
}

interface AppStore extends AppState {
  hydrated: boolean;
  signIn: (email: string, name?: string) => void;
  signOut: () => void;
  addAnalysis: (analysis: Analysis) => void;
  setActualViews: (id: string, views: number) => void;
  setPlan: (plan: PlanId, cycle?: "monthly" | "yearly") => void;
  cancelSubscription: () => void;
  toggleInstagram: () => void;
  canAnalyze: boolean;
}

const defaultState: AppState = {
  user: null,
  analyses: seedAnalyses,
  subscription: {
    plan: "free",
    status: "active",
    renewsAt: "2026-03-01T09:00:00.000Z",
    usedThisMonth: 1,
    monthlyLimit: PLAN_LIMITS.free,
    billingCycle: "monthly",
  },
  instagramConnected: false,
};

const KEY = "reelpredict.state.v1";
const AppContext = createContext<AppStore | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setState({ ...defaultState, ...(JSON.parse(raw) as AppState) });
    } catch {
      /* ignore corrupt state */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable */
    }
  }, [state, hydrated]);

  const signIn = useCallback((email: string, name?: string) => {
    setState((s) => ({
      ...s,
      user: { email, name: name || email.split("@")[0] || "Creator" },
    }));
  }, []);

  const signOut = useCallback(() => setState((s) => ({ ...s, user: null })), []);

  const addAnalysis = useCallback((analysis: Analysis) => {
    setState((s) => ({
      ...s,
      analyses: [analysis, ...s.analyses],
      subscription: { ...s.subscription, usedThisMonth: s.subscription.usedThisMonth + 1 },
    }));
  }, []);

  const setActualViews = useCallback((id: string, views: number) => {
    setState((s) => ({
      ...s,
      analyses: s.analyses.map((a) =>
        a.id === id ? { ...a, actualViews: views, status: "Completed" } : a,
      ),
    }));
  }, []);

  const setPlan = useCallback((plan: PlanId, cycle: "monthly" | "yearly" = "monthly") => {
    setState((s) => ({
      ...s,
      subscription: {
        ...s.subscription,
        plan,
        status: "active",
        monthlyLimit: PLAN_LIMITS[plan],
        billingCycle: cycle,
        renewsAt: new Date(Date.now() + 30 * 86400000).toISOString(),
      },
    }));
  }, []);

  const cancelSubscription = useCallback(
    () => setState((s) => ({ ...s, subscription: { ...s.subscription, status: "canceled" } })),
    [],
  );

  const toggleInstagram = useCallback(
    () => setState((s) => ({ ...s, instagramConnected: !s.instagramConnected })),
    [],
  );

  const value = useMemo<AppStore>(
    () => ({
      ...state,
      hydrated,
      signIn,
      signOut,
      addAnalysis,
      setActualViews,
      setPlan,
      cancelSubscription,
      toggleInstagram,
      canAnalyze: state.subscription.usedThisMonth < state.subscription.monthlyLimit,
    }),
    [
      state,
      hydrated,
      signIn,
      signOut,
      addAnalysis,
      setActualViews,
      setPlan,
      cancelSubscription,
      toggleInstagram,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppStore() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppStore must be used inside AppStoreProvider");
  return ctx;
}

export function formatNumber(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K`;
  return `${n}`;
}
