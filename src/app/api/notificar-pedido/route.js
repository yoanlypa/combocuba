import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request) {
  const { pedidoId } = await request.json();

  if (!pedidoId) {
    return NextResponse.json({ error: "Falta pedidoId" }, { status: 400 });
  }

  const supabase = await createClient();

  const { data: pedido, error } = await supabase
    .from("pedidos")
    .select(
      `id, destinatario_nombre, destinatario_telefono, destinatario_direccion,
       destinatario_provincia, notas, total,
       tiendas(nombre, email_contacto, telegram_chat_id),
       perfiles(nombre, telefono),
       pedido_items(cantidad, productos(nombre), combos(nombre))`
    )
    .eq("id", pedidoId)
    .maybeSingle();

  if (error || !pedido) {
    return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
  }

  const itemsTexto = pedido.pedido_items
    .map((item) => `${item.cantidad}x ${item.productos?.nombre ?? item.combos?.nombre ?? "Producto"}`)
    .join(", ");

  const mensaje = [
    `Nuevo pedido en ${pedido.tiendas.nombre}`,
    `Comprador: ${pedido.perfiles?.nombre ?? "—"} (${pedido.perfiles?.telefono ?? "sin teléfono"})`,
    `Destinatario en Cuba: ${pedido.destinatario_nombre} · ${pedido.destinatario_provincia}`,
    `Dirección: ${pedido.destinatario_direccion}`,
    `Teléfono en Cuba: ${pedido.destinatario_telefono || "—"}`,
    `Pedido: ${itemsTexto}`,
    `Total: $${Number(pedido.total).toFixed(2)}`,
    `Notas: ${pedido.notas || "—"}`,
  ].join("\n");

  const resultados = await Promise.allSettled([
    enviarEmail(pedido.tiendas.email_contacto, pedido.tiendas.nombre, mensaje),
    enviarTelegram(pedido.tiendas.telegram_chat_id, mensaje),
  ]);

  return NextResponse.json({ ok: true, resultados: resultados.map((r) => r.status) });
}

async function enviarEmail(destinatario, tiendaNombre, mensaje) {
  if (!destinatario || !process.env.RESEND_API_KEY) return;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "ComboCuba <onboarding@resend.dev>",
      to: destinatario,
      subject: `Nuevo pedido en ${tiendaNombre}`,
      text: mensaje,
    }),
  });
}

async function enviarTelegram(chatId, mensaje) {
  if (!chatId || !process.env.TELEGRAM_BOT_TOKEN) return;

  await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text: mensaje }),
  });
}
