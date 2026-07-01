import AgregarBoton from "./AgregarBoton";

export default function ComboCard({ combo, productos }) {
  const items = combo.itemsIds
    .map((id) => productos.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-2 text-3xl">📦</div>
      <h3 className="font-semibold text-slate-900">{combo.nombre}</h3>
      <p className="mt-1 text-sm text-slate-500">{combo.descripcion}</p>
      <ul className="mt-3 space-y-1 text-sm text-slate-600">
        {items.map((p) => (
          <li key={p.id}>
            {p.emoji} {p.nombre}
          </li>
        ))}
      </ul>
      <div className="mt-auto flex items-center justify-between pt-4">
        <span className="text-lg font-bold text-slate-900">${combo.precio}</span>
        <AgregarBoton
          item={{
            id: combo.id,
            tipo: "combo",
            nombre: combo.nombre,
            precio: combo.precio,
          }}
        />
      </div>
    </div>
  );
}
