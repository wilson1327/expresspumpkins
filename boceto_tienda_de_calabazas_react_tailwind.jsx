// Boceto: Tienda de Calabazas "Pumpkin Express"
// Un solo archivo React + Tailwind. Reemplaza imágenes, textos y precios.
// Nota: necesitas implementar un endpoint /api/create-checkout-session para Stripe (o usar PayPal/Zelle manualmente).

import React, { useState } from "react";

const PRODUCTS = [
  {
    id: "small",
    name: "Calabaza Pequeña",
    desc: "Perfecta para mesas y decoraciones pequeñas.",
    price: 6.0,
    img: "https://via.placeholder.com/600x420?text=Calabaza+Peque%C3%B1a",
  },
  {
    id: "medium",
    name: "Calabaza Mediana",
    desc: "Ideal para tallar y colocar en el porche.",
    price: 12.0,
    img: "https://via.placeholder.com/600x420?text=Calabaza+Mediana",
  },
  {
    id: "large",
    name: "Calabaza Grande",
    desc: "Gran tamaño: la que más destaca en tu decoración.",
    price: 20.0,
    img: "https://via.placeholder.com/600x420?text=Calabaza+Grande",
  },
];

export default function PumpkinStore() {
  const [cart, setCart] = useState([]);
  const [query, setQuery] = useState("");
  const [showCart, setShowCart] = useState(false);

  function addToCart(product, qty = 1) {
    setCart((c) => {
      const exists = c.find((i) => i.id === product.id);
      if (exists) {
        return c.map((i) => (i.id === product.id ? { ...i, qty: i.qty + qty } : i));
      }
      return [...c, { ...product, qty }];
    });
  }

  function updateQty(id, qty) {
    setCart((c) => c.map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i)));
  }

  function removeItem(id) {
    setCart((c) => c.filter((i) => i.id !== id));
  }

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const deliveryFee = cart.length ? 4.0 : 0;
  const total = subtotal + deliveryFee;

  async function checkout() {
    // Ejemplo: llamar a tu endpoint server-side que crea la sesión de pago (Stripe Checkout)
    // Reemplaza /api/create-checkout-session por el endpoint que configures.
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart, deliveryFee }),
      });
      const data = await res.json();
      if (data.url) {
        // redirige a Stripe Checkout (o a PayPal) según lo que implementes
        window.location.href = data.url;
      } else {
        alert("Respuesta inesperada del servidor. Revisa la consola.");
        console.error(data);
      }
    } catch (e) {
      console.error(e);
      alert("Error al iniciar el pago. Revisa la consola del navegador.");
    }
  }

  const filtered = PRODUCTS.filter((p) =>
    (p.name + " " + p.desc).toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white p-6">
      <header className="max-w-6xl mx-auto flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Pumpkin Express</h1>
          <p className="text-sm text-gray-600">Entrega de calabazas en menos de 24 horas 🎃</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-700 text-right">
            <div>Zona: <span className="font-medium">Tu ciudad</span></div>
            <div className="text-xs text-gray-500">Entrega rápida · Pago seguro</div>
          </div>
          <button
            onClick={() => setShowCart(true)}
            className="bg-orange-600 text-white px-4 py-2 rounded-2xl shadow-md"
          >
            Carrito ({cart.reduce((s, i) => s + i.qty, 0)})
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* left: QR + info */}
        <section className="md:col-span-1 bg-white p-4 rounded-2xl shadow">
          <h2 className="text-lg font-semibold mb-2">Pide con el QR</h2>
          <p className="text-sm text-gray-600 mb-4">
            Escanea el QR para abrir esta tienda en tu celular y comprar en 1 minuto.
          </p>
          <div className="w-full flex justify-center mb-4">
            {/* Placeholder QR: reemplaza por un QR real apuntando a tu dominio */}
            <img
              alt="QR placeholder"
              src="https://via.placeholder.com/240x240?text=QR+TU+LINK"
              className="w-56 h-56 object-cover rounded-lg"
            />
          </div>
          <div className="space-y-2 text-sm">
            <div>
              <strong>Cómo pedir:</strong>
              <ol className="list-decimal ml-5">
                <li>Escanea o entra al enlace.</li>
                <li>Elige talla y cantidad.</li>
                <li>Paga con tarjeta o PayPal.</li>
                <li>Recibe en menos de 24 hrs.</li>
              </ol>
            </div>
            <div className="pt-2">
              <strong>Recomendado:</strong>
              <p className="text-gray-600">Combos con dulces y luces LED.</p>
            </div>
          </div>
        </section>

        {/* products */}
        <section className="md:col-span-2">
          {/* search + filters */}
          <div className="flex items-center gap-3 mb-4">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar calabaza, talla o combo..."
              className="flex-1 p-3 rounded-xl shadow-sm border border-gray-200"
            />
            <select className="p-3 rounded-xl border border-gray-200">
              <option>Orden: Más populares</option>
              <option>Más baratas</option>
              <option>Más caras</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((p) => (
              <article key={p.id} className="bg-white p-4 rounded-2xl shadow hover:shadow-lg transition">
                <div className="flex gap-4">
                  <img src={p.img} alt={p.name} className="w-36 h-28 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{p.name}</h3>
                    <p className="text-xs text-gray-500">{p.desc}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div>
                        <div className="text-sm text-gray-600">Precio</div>
                        <div className="text-xl font-bold">${p.price.toFixed(2)}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          className="px-3 py-1 rounded-lg border"
                          onClick={() => addToCart(p, 1)}
                        >
                          Agregar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* extras: combos */}
          <div className="mt-6 p-4 bg-white rounded-2xl shadow">
            <h4 className="font-semibold mb-2">Combos populares</h4>
            <div className="flex gap-4">
              <div className="flex-1 p-3 border rounded-lg">
                <div className="text-sm">Pack Decoración</div>
                <div className="font-bold">Calabaza mediana + pajina de diseños </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-lg font-semibold">$18.00</div>
                  <button onClick={() => addToCart({ id: 'combo-deco', name: 'Pack Decoración', price: 18.0 }, 1)} className="px-3 py-1 rounded-lg border">Agregar</button>
                </div>
              </div>
              <div className="flex-1 p-3 border rounded-lg">
                <div className="text-sm">Pack Fiesta</div>
                <div className="font-bold">Calabaza + bolsa de dulces</div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="text-lg font-semibold">$22.00</div>
                  <button onClick={() => addToCart({ id: 'combo-fiesta', name: 'Pack Fiesta', price: 22.0 }, 1)} className="px-3 py-1 rounded-lg border">Agregar</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Cart modal/sidebar */}
      {showCart && (
        <div className="fixed inset-0 bg-black/40 flex items-end md:items-center justify-center z-50">
          <div className="bg-white w-full md:w-96 rounded-t-2xl md:rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Tu pedido</h3>
              <button onClick={() => setShowCart(false)} className="text-gray-500">Cerrar</button>
            </div>
            <div className="space-y-3 max-h-72 overflow-y-auto">
              {cart.length === 0 && <div className="text-sm text-gray-500">No hay artículos aún.</div>}
              {cart.map((it) => (
                <div key={it.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{it.name}</div>
                    <div className="text-xs text-gray-500">${it.price.toFixed(2)}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(it.id, it.qty - 1)} className="px-2 rounded border">-</button>
                    <div>{it.qty}</div>
                    <button onClick={() => updateQty(it.id, it.qty + 1)} className="px-2 rounded border">+</button>
                    <button onClick={() => removeItem(it.id)} className="ml-2 text-xs text-red-500">Quitar</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t pt-4">
              <div className="flex justify-between text-sm text-gray-600">
                <div>Subtotal</div>
                <div>${subtotal.toFixed(2)}</div>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <div>Envío</div>
                <div>${deliveryFee.toFixed(2)}</div>
              </div>
              <div className="flex justify-between font-bold text-lg mt-2">
                <div>Total</div>
                <div>${total.toFixed(2)}</div>
              </div>

              <div className="mt-4 flex gap-2">
                <button onClick={checkout} className="flex-1 bg-orange-600 text-white py-2 rounded-2xl">Pagar</button>
                <button onClick={() => { navigator.clipboard && navigator.clipboard.writeText(window.location.href); alert('Enlace copiado!'); }} className="px-3 py-2 border rounded-2xl">Compartir</button>
              </div>

              <div className="text-xs text-gray-500 mt-2">Al pagar aceptas nuestros términos. Tus datos se usan solo para la entrega.</div>
            </div>
          </div>
        </div>
      )}

      <footer className="max-w-6xl mx-auto mt-10 text-center text-sm text-gray-500">© {new Date().getFullYear()} Pumpkin Express — Entregas en menos de 24 hrs</footer>
    </div>
  );
}

/*
INSTRUCCIONES (en el código):
- Reemplaza las URLs de placeholder en PRODUCTS[].img con tus fotos reales.
- Ajusta precios y descripciones.
- Implementa /api/create-checkout-session en tu hosting (Vercel/Netlify/AWS) para integrar Stripe o PayPal.
- Ten en cuenta: para pagos rápidos sin backend puedes usar botones de PayPal, o redirigir a una página de pago externa.
*/
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pumpking Express - Pedido a domicilio</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #ff7518; /* Naranja calabaza 🎃 */
      color: #fff;
      margin: 0;
      padding: 0;
    }

    header {
      text-align: center;
      padding: 2rem;
      background-color: #e65c00;
    }

    header h1 {
      margin: 0;
      font-size: 2.5rem;
    }

    form {
      max-width: 500px;
      margin: 2rem auto;
      padding: 2rem;
      background: #fff;
      color: #333;
      border-radius: 15px;
      box-shadow: 0px 4px 15px rgba(0,0,0,0.2);
    }

    label {
      display: block;
      margin: 1rem 0 0.5rem;
      font-weight: bold;
    }

    input, textarea {
      width: 100%;
      padding: 0.8rem;
      border-radius: 8px;
      border: 1px solid #ccc;
      font-size: 1rem;
    }

    button {
      margin-top: 1.5rem;
      width: 100%;
      padding: 1rem;
      background: #ff7518;
      border: none;
      border-radius: 10px;
      font-size: 1.2rem;
      color: #fff;
      cursor: pointer;
      transition: background 0.3s ease;
    }

    button:hover {
      background: #e65c00;
    }

    footer {
      text-align: center;
      padding: 1rem;
      background: #e65c00;
      margin-top: 2rem;
    }
  </style>
</head>
<body>
  <header>
    <h1>Pumpking Express 🎃</h1>
    <p>Pedidos frescos y confiables hasta tu puerta 🚚</p>
  </header>

  <form action="https://formsubmit.co/TU_CORREO@gmail.com" method="POST">
    <label>Nombre:</label>
    <input type="text" name="nombre" required>

    <label>Dirección:</label>
    <input type="text" name="direccion" required>

    <label>Teléfono:</label>
    <input type="tel" name="telefono" required>

    <label>Pedido:</label>
    <textarea name="pedido" rows="4" required></textarea>

    <button type="submit">Hacer Pedido ✅</button>
  </form>

  <footer>
    <p>© 2025 Pumpking Express 🍂</p>
  </footer>
</body>
</html>


