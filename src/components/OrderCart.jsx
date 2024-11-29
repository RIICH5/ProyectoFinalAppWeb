import React, { useContext } from "react";
import { db } from "../services/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { OrderContext } from "../contexts/OrderContext";
import { getAuth } from "firebase/auth";

const OrderCart = () => {
  const { cart, total, removeFromCart, clearCart } = useContext(OrderContext);
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  const handleConfirmOrder = async () => {
    if (cart.length === 0) {
      alert("El carrito está vacío.");
      return;
    }

    if (!userId) {
      alert("Debes iniciar sesión para confirmar un pedido.");
      return;
    }

    try {
      const order = {
        userId, // ID del usuario autenticado
        items: cart, // Productos en el carrito
        total, // Total del pedido
        createdAt: serverTimestamp(), // Timestamp automático
      };

      // Guardar el pedido en la colección "orders" en Firestore
      await addDoc(collection(db, "orders"), order);

      // Limpiar el carrito después de confirmar el pedido
      clearCart();
      alert("Pedido confirmado. ¡Gracias!");
    } catch (error) {
      console.error("Error al confirmar el pedido:", error);
      alert("Hubo un error al confirmar el pedido. Intenta de nuevo.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-lg mt-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Carrito de Compras</h2>
      {cart.length === 0 ? (
        <p className="text-center text-gray-500">Tu carrito está vacío.</p>
      ) : (
        <>
          <ul className="divide-y divide-gray-200">
            {cart.map((item) => (
              <li key={item.id} className="flex justify-between items-center py-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                  <p className="text-gray-600">
                    {item.quantity} x ${item.price.toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 font-semibold"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <p className="text-lg font-bold text-gray-800">
              Total: <span className="text-green-600">${total.toFixed(2)}</span>
            </p>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleConfirmOrder}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg shadow-lg"
            >
              Realizar Pago
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderCart;
