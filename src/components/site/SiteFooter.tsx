import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/Logo";

const columns: { title: string; items: { label: string; to?: string }[] }[] = [
  {
    title: "Mahsulot",
    items: [
      { label: "Imkoniyatlar", to: "/" },
      { label: "Narxlar", to: "/pricing" },
      { label: "Tahlilchi", to: "/analyze" },
      { label: "Hisob Intellekti", to: "/accounts" },
    ],
  },
  {
    title: "Resurslar",
    items: [{ label: "Hujjatlar" }, { label: "Bashorat metodologiyasi" }, { label: "O'zgarishlar jurnali" }],
  },
  {
    title: "Kompaniya",
    items: [{ label: "Maxfiylik" }, { label: "Shartlar" }, { label: "Aloqa" }],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <Logo withTagline />
          <p className="mt-5 max-w-xs text-xs leading-relaxed text-muted-foreground">
            REELPREDICT — mavjud Instagram ma'lumotlari, ommaviy hujjatlashtirilgan reyting
            signallari va hisobning tarixiy samaradorligi asosida qurilgan AI bashorat tizimi.
            U Meta'ning maxfiy reyting algoritmiga kirish huquqiga ega emas.
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
        © {new Date().getFullYear()} REELPREDICT. Bashoratlar mavjud ma'lumotlar va tarixiy
        samaradorlik signallari asosidagi taxminlardir. Haqiqiy natijalar farq qilishi mumkin.
      </div>
    </footer>
  );
}
