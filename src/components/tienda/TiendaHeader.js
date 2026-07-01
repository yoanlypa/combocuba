import Link from "next/link";
import CartBadge from "./CartBadge";

export default function TiendaHeader({ tiendaSlug, tiendaNombre }) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href={`/${tiendaSlug}`} className="font-semibold text-slate-900 hover:text-sky-600">
          {tiendaNombre ?? "Volver a la tienda"}
        </Link>
        <CartBadge tiendaSlug={tiendaSlug} />
      </div>
    </header>
  );
}
