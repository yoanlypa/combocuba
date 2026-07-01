import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <span className="rounded-full bg-sky-100 px-3 py-1 text-sm font-medium text-sky-700">
          Plataforma para negocios de envíos a Cuba
        </span>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-900">
          ComboCuba
        </h1>
        <p className="mt-4 max-w-xl text-lg text-slate-600">
          Cada empresa de envíos tiene su propia tienda online: sube sus
          combos y productos, y recibe los pedidos listos para cerrar la
          venta por WhatsApp.
        </p>

        <div className="mt-10 grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
          <Link
            href="/la-habana-express"
            className="rounded-xl border border-slate-200 bg-white p-4 text-left hover:border-sky-300"
          >
            <p className="font-semibold text-slate-900">Tienda demo</p>
            <p className="mt-1 text-sm text-slate-500">
              Lo que ve un cliente comprando un combo.
            </p>
          </Link>
          <Link
            href="/panel"
            className="rounded-xl border border-slate-200 bg-white p-4 text-left hover:border-sky-300"
          >
            <p className="font-semibold text-slate-900">Panel de tienda</p>
            <p className="mt-1 text-sm text-slate-500">
              Donde el dueño gestiona productos y pedidos.
            </p>
          </Link>
          <Link
            href="/admin"
            className="rounded-xl border border-slate-200 bg-white p-4 text-left hover:border-sky-300"
          >
            <p className="font-semibold text-slate-900">Super-admin</p>
            <p className="mt-1 text-sm text-slate-500">
              Donde tú das de alta tiendas nuevas.
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
}
