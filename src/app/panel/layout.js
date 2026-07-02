import PanelNav from "@/components/panel/PanelNav";

export default function PanelLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <aside className="border-b border-slate-200 bg-white lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="px-4 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Panel de tienda
          </p>
        </div>
        <PanelNav />
      </aside>
      <main className="flex-1 px-4 py-6 lg:px-8">{children}</main>
    </div>
  );
}
