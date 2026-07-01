import { CartProvider } from "@/lib/cart-context";
import { createClient } from "@/lib/supabase/server";
import TiendaHeader from "@/components/tienda/TiendaHeader";

export default async function TiendaLayout({ children, params }) {
  const { tienda: slug } = await params;
  const supabase = await createClient();
  const { data: tienda } = await supabase
    .from("tiendas")
    .select("nombre")
    .eq("slug", slug)
    .eq("activa", true)
    .maybeSingle();

  return (
    <CartProvider tiendaSlug={slug}>
      <div className="min-h-screen bg-slate-50">
        <TiendaHeader tiendaSlug={slug} tiendaNombre={tienda?.nombre} />
        {children}
      </div>
    </CartProvider>
  );
}
