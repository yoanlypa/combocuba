export const tiendas = [
  {
    slug: "la-habana-express",
    nombre: "La Habana Express",
    descripcion: "Combos de comida y aseo con entrega en toda Cuba",
    whatsapp: "5215555555555",
    productos: [
      { id: "p1", nombre: "Aceite 1 galón", precio: 18, pesoLb: 8, emoji: "🛢️" },
      { id: "p2", nombre: "Arroz 25 lb", precio: 22, pesoLb: 25, emoji: "🍚" },
      { id: "p3", nombre: "Muslos de pollo 10 lb", precio: 19, pesoLb: 10, emoji: "🍗" },
      { id: "p4", nombre: "Frijoles negros 10 lb", precio: 15, pesoLb: 10, emoji: "🫘" },
      { id: "p5", nombre: "Detergente 5 lb", precio: 12, pesoLb: 5, emoji: "🧼" },
      { id: "p6", nombre: "Leche en polvo 5 lb", precio: 24, pesoLb: 5, emoji: "🥛" },
    ],
    combos: [
      {
        id: "c1",
        nombre: "Combo Familiar",
        descripcion: "Lo esencial para el mes: aceite, arroz, pollo y frijoles.",
        precio: 65,
        itemsIds: ["p1", "p2", "p3", "p4"],
      },
      {
        id: "c2",
        nombre: "Combo Aseo",
        descripcion: "Detergente y artículos de limpieza del hogar.",
        precio: 12,
        itemsIds: ["p5"],
      },
    ],
  },
];

export function getTiendaBySlug(slug) {
  return tiendas.find((t) => t.slug === slug) ?? null;
}

export const pedidosDemo = [
  {
    id: "pd1",
    compradorNombre: "Yaditza Pérez",
    compradorTelefono: "+1 786 555 0182",
    destinatarioNombre: "Osvaldo Pérez",
    destinatarioProvincia: "La Habana",
    items: "1x Combo Familiar",
    total: 65,
    estado: "nuevo",
    creado: "Hoy, 10:24 am",
  },
  {
    id: "pd2",
    compradorNombre: "Raúl Gómez",
    compradorTelefono: "+1 305 555 0911",
    destinatarioNombre: "Mireya Gómez",
    destinatarioProvincia: "Santiago de Cuba",
    items: "2x Arroz 25 lb, 1x Detergente 5 lb",
    total: 56,
    estado: "contactado",
    creado: "Ayer, 4:10 pm",
  },
  {
    id: "pd3",
    compradorNombre: "Liset Fonseca",
    compradorTelefono: "+34 611 222 333",
    destinatarioNombre: "Ana Fonseca",
    destinatarioProvincia: "Matanzas",
    items: "1x Combo Aseo",
    total: 12,
    estado: "cerrado",
    creado: "Lunes, 9:02 am",
  },
];
