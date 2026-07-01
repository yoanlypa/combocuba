import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getTiendaPublica } from "@/lib/supabase/queries";
import ComboCard from "@/components/tienda/ComboCard";
import ProductoCard from "@/components/tienda/ProductoCard";
import CartBadge from "@/components/tienda/CartBadge";

export default async function TiendaPage({ params }) {
  const { tienda: slug } = await params;
  const supabase = await createClient();
  const tienda = await getTiendaPublica(supabase, slug);

  if (!tienda) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Tienda no encontrada</h1>
        <p className="mt-2 text-slate-500">
          Revisa el enlace o contacta a la empresa de envíos.
        </p>
        <Link href="/" className="mt-6 inline-block text-sky-600 hover:underline">
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div>
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">{tienda.nombre}</h1>
            <p className="text-sm text-slate-500">{tienda.descripcion}</p>
          </div>
          <CartBadge tiendaSlug={slug} />
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-10 px-4 py-8">
        {tienda.combos.length > 0 && (
          <section>
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Combos</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tienda.combos.map((combo) => (
                <ComboCard key={combo.id} combo={combo} />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Productos individuales</h2>
          {tienda.productos.length === 0 ? (
            <p className="text-sm text-slate-500">Esta tienda todavía no tiene productos.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {tienda.productos.map((producto) => (
                <ProductoCard key={producto.id} producto={producto} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
