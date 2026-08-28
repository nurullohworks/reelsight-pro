import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/Logo";

const columns: { title: string; items: { label: string; to?: string }[] }[] = [
  {
    title: "Product",
    items: [
      { label: "Features", to: "/" },
      { label: "Pricing", to: "/pricing" },
      { label: "Analyzer", to: "/analyze" },
      { label: "Account Intelligence", to: "/accounts" },
    ],
  },
  {
    title: "Resources",
    items: [{ label: "Documentation" }, { label: "Prediction methodology" }, { label: "Changelog" }],
  },
  {
    title: "Company",
    items: [{ label: "Privacy" }, { label: "Terms" }, { label: "Contact" }],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Logo withTagline />
          <p className="mt-5 max-w-xs text-xs leading-relaxed text-muted-foreground">
            REELPREDICT is an AI prediction engine built on available Instagram data, publicly
            documented ranking signals and historical account performance. It has no access to
            Meta's private ranking algorithm.
          </p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="text-xs uppercase tracking-widest text-muted-foreground">{col.title}</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {col.items.map((item) => (
                <li key={item.label}>
                  {item.to ? (
                    <Link to={item.to} className="text-foreground/80 transition-colors hover:text-foreground">
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-foreground/60">{item.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border px-5 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} REELPREDICT. Predictions are estimates based on available data
        and historical performance signals. Actual results may vary.
      </div>
    </footer>
  );
}
