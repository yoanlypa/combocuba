export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Super-admin
          </p>
          <h1 className="font-semibold text-slate-900">ComboCuba — Administración</h1>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
    </div>
  );
}
