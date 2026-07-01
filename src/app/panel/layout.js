import Link from "next/link";

const NAV = [
  { href: "/panel", label: "Resumen" },
  { href: "/panel/pedidos", label: "Pedidos" },
  { href: "/panel/productos", label: "Productos" },
  { href: "/panel/combos", label: "Combos" },
];

export default function PanelLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <aside className="border-b border-slate-200 bg-white lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="px-4 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Panel de tienda
          </p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-2 pb-2 lg:flex-col lg:overflow-visible lg:px-2">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 px-4 py-6 lg:px-8">{children}</main>
    </div>
  );
}
