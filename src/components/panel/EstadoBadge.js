const ESTILOS = {
  nuevo: "bg-sky-100 text-sky-700",
  contactado: "bg-amber-100 text-amber-700",
  cerrado: "bg-emerald-100 text-emerald-700",
  cancelado: "bg-red-100 text-red-700",
};

export default function EstadoBadge({ estado }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
        ESTILOS[estado] ?? "bg-slate-100 text-slate-700"
      }`}
    >
      {estado}
    </span>
  );
}
