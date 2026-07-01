import { CartProvider } from "@/lib/cart-context";

export default async function TiendaLayout({ children, params }) {
  const { tienda } = await params;

  return (
    <CartProvider tiendaSlug={tienda}>
      <div className="min-h-screen bg-slate-50">{children}</div>
    </CartProvider>
  );
}
