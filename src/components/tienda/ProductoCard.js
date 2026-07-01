import AgregarBoton from "./AgregarBoton";

export default function ProductoCard({ producto }) {
  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-2 text-3xl">{producto.emoji}</div>
      <h3 className="font-medium text-slate-900">{producto.nombre}</h3>
      <p className="mt-1 text-xs text-slate-500">{producto.peso_lb} lb</p>
      <div className="mt-auto flex items-center justify-between pt-4">
        <span className="font-bold text-slate-900">${producto.precio}</span>
        <AgregarBoton
          item={{
            id: producto.id,
            tipo: "producto",
            nombre: producto.nombre,
            precio: producto.precio,
          }}
        />
      </div>
    </div>
  );
}
