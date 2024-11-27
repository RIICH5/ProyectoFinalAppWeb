import React, { useContext } from "react";
import { OrderContext } from "../contexts/OrderContext";
import { db } from "../services/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const OrderCart = ({ userId }) => {
  const { cart, total, removeFromCart } = useContext(OrderContext);

  const handleConfirmOrder = async () => {
    try {
      const order = {
        userId,
        items: cart,
        total,
        createdAt: serverTimestamp(),
      };
      await addDoc(collection(db, "orders"), order);
      alert("Pedido confirmado!");
    } catch (error) {
      console.error("Error al confirmar el pedido:", error);
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
            <li key={item.id} className="flex justify-between">
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
        className="bg-blue-500 text-white p-2 mt-4"
      >
        Confirmar Pedido
      </button>
    </div>
  );
};

export default OrderCart;
