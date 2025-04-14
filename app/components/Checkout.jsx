"use client";

import { useEffect, useState } from "react";

export default function Checkout({ selectedItems }) {
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    // Hitung subtotal dari item yang dipilih
    const total = selectedItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    setSubtotal(total);
  }, [selectedItems]);

  const handleCheckoutClick = () => {
    if (selectedItems.length === 0) {
      alert("Pilih setidaknya satu item untuk checkout.");
      return;
    }
    setShowOrderSummary(true);
  };

  const handlePayment = async () => {
    const response = await fetch("/api/tokenizer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: selectedItems }),
    });

    const data = await response.json();

    if (data.token) {
      window.snap.pay(data.token);
    } else {
      alert("Gagal memulai pembayaran");
    }
  };

  const closeOrderSummary = () => {
    setShowOrderSummary(false);
  };

  useEffect(() => {
    const snapScript = "https://app.sandbox.midtrans.com/snap/snap.js";
    const clientKey = process.env.NEXT_PUBLIC_CLIENT;
    
    // Pastikan clientKey ada sebelum membuat script
    if (!clientKey) {
      console.error("Midtrans Client Key tidak ditemukan");
      return;
    }
    
    const script = document.createElement("script");
    script.src = snapScript;
    script.setAttribute("data-client-key", clientKey);
    script.async = true;
    
    document.body.appendChild(script);
    
    return () => {
      // Pastikan script masih ada sebelum menghapusnya
      if (script && document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleCheckoutClick}
      >
        Checkout
      </button>

      {/* Modal ringkasan pesanan */}
      {showOrderSummary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl text-black font-bold mb-4">Ringkasan Pesanan</h2>
            
            <div className="max-h-60 text-black overflow-y-auto mb-4">
              {selectedItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-medium text-base">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      {item.quantity} x Rp {item.price.toLocaleString()}
                    </p>
                  </div>
                  <p className="font-medium">
                    Rp {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between text-black font-bold text-lg mt-4 pt-2 border-t">
              <p>Total</p>
              <p>Rp {subtotal.toLocaleString()}</p>
            </div>
            
            <div className="flex justify-between mt-6">
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
                onClick={closeOrderSummary}
              >
                Kembali
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handlePayment}
              >
                Bayar Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
