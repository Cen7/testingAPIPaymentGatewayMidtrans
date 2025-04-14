"use client";

import Image from "next/image";
import { product } from "./libs/product";
import { useEffect, useState } from "react";
import Checkout from "./components/Checkout";

export default function Home() {
  const [quantities, setQuantities] = useState({});
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    const initialQuantities = {};
    product.forEach((item) => {
      initialQuantities[item.id] = 0;
    });
    setQuantities(initialQuantities);
  }, []);

  useEffect(() => {
    const total = product.reduce((acc, item) => {
      return acc + item.price * (quantities[item.id] || 0);
    }, 0);
    setSubtotal(total);
  }, [quantities]);

  const updateQuantity = (id, type) => {
    setQuantities((prev) => {
      const newQty = type === "inc" ? prev[id] + 1 : Math.max(prev[id] - 1, 0);
      return { ...prev, [id]: newQty };
    });
  };

  // Menyiapkan array selectedItems yang akan diteruskan ke komponen Checkout
  const selectedItems = product
    .filter((item) => quantities[item.id] > 0)
    .map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: quantities[item.id],
    }));

  return (
    <main className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Menu</h1>
      {product.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between border-b py-4"
        >
          <Image
            src={item.image}
            alt={item.name}
            width={150}
            height={150}
            className="rounded-md object-cover"
          />
          <div className="flex-1 px-4">
            <h3 className="text-lg font-semibold">{item.name}</h3>
            <p className="text-sm text-gray-600">Rp {item.price.toLocaleString()}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => updateQuantity(item.id, "dec")}
              className="w-8 h-8 flex items-center justify-center bg-blue-400 rounded-full text-lg"
            >
              −
            </button>
            <span>{quantities[item.id] || 0}</span>
            <button
              onClick={() => updateQuantity(item.id, "inc")}
              className="w-8 h-8 flex items-center justify-center bg-blue-400 rounded-full text-lg"
            >
              +
            </button>
          </div>
        </div>
      ))}

      <div className="flex justify-between items-center mt-6 border-t pt-4">
        <p className="text-lg font-semibold">
          Subtotal: Rp {subtotal.toLocaleString()}
        </p>
        {/* Menggunakan komponen Checkout dan meneruskan selectedItems */}
        <Checkout selectedItems={selectedItems} />
      </div>
    </main>
  );
}
