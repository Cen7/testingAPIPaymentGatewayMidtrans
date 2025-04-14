// app/api/tokenizer/route.js
import Midtrans from "midtrans-client";
import { NextResponse } from "next/server";

let snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: process.env.NEXT_PUBLIC_SECRET,
});

export async function POST(request) {
  const { items } = await request.json();

  const gross_amount = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const orderId = `ORDER-${Date.now()}`;

  // Format item details sesuai format Midtrans
  const formattedItems = items.map(item => ({
    id: item.id.toString(),
    price: item.price,
    quantity: item.quantity,
    name: item.name, // Pastikan nama menu terkirim ke Midtrans
  }));

  const parameter = {
    transaction_details: {
      order_id: orderId,
      gross_amount,
    },
    item_details: formattedItems,
    enabled_payments: ["qris", "gopay", "bca_va", "bni_va", "other_va", "credit_card"],
  };

  try {
    const transaction = await snap.createTransaction(parameter);
    return NextResponse.json({ token: transaction.token });
  } catch (error) {
    console.error("Midtrans Error:", error);
    return NextResponse.json({ error: "Gagal membuat token" }, { status: 500 });
  }
}
