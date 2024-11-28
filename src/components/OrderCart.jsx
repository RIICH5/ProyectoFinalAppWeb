import React, { useContext } from "react";
import { OrderContext } from "../contexts/OrderContext"; // Contexto del carrito
import { db } from "../services/firebaseConfig"; // Firebase Firestore
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const OrderCart = ({ userId }) => {
  const { cart, total, removeFromCart, clearCart } = useContext(OrderContext);

  const handleConfirmOrder = async () => {
    if (cart.length === 0) {
      alert("El carrito está vacío.");
      return;
    }

    try {
      const order = {
        userId,
        items: cart,
        total,
        createdAt: serverTimestamp(),
      };
      await addDoc(collection(db, "orders"), order); // Guardar el pedido en Firestore

      clearCart(); // Vaciar el carrito después de confirmar el pedido
      alert("Pedido confirmado. ¡Gracias!");
    } catch (error) {
      console.error("Error al confirmar el pedido:", error);
      alert("Hubo un error al confirmar el pedido. Intenta de nuevo.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">Carrito de Compras</h2>
      {cart.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <ul>
          {cart.map((item) => (
            <li key={item.id} className="flex justify-between items-center">
              <span>
                {item.name} - {item.quantity} x ${item.price.toFixed(2)}
              </span>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
      <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
      <button
        onClick={handleConfirmOrder}
        className="bg-green-500 text-white px-4 py-2 mt-4 rounded"
      >
        Confirmar Pedido
      </button>
    </div>
  );
};

export default OrderCart;
