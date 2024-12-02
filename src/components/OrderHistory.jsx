import React, { useState, useEffect } from "react";
import { db } from "../services/firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Para obtener el usuario autenticado

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // Indicador de carga
  const [error, setError] = useState(null); // Manejo de errores
  const auth = getAuth(); // Obtener autenticación
  const userId = auth.currentUser?.uid; // ID del usuario autenticado

  useEffect(() => {
    if (!userId) {
      setError("Usuario no autenticado.");
      setLoading(false);
      return;
    }

    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, where("userId", "==", userId));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedOrders = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(fetchedOrders);
        setLoading(false); // Detener indicador de carga
      },
      (err) => {
        console.error("Error al cargar el historial de pedidos:", err);
        setError("No se pudieron cargar los pedidos. Intenta nuevamente más tarde.");
        setLoading(false); // Detener indicador de carga
      }
    );

    return () => unsubscribe();
  }, [userId]);

  if (loading) return <p className="text-gray-600">Cargando historial de pedidos...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-lg mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Historial de Pedidos</h2>
      {orders.length === 0 ? (
        <p className="text-center text-gray-500">No tienes pedidos anteriores.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {orders.map((order) => (
            <li key={order.id} className="border p-4 mb-4">
              <p>
                <strong>ID del Pedido:</strong> {order.id}
              </p>
              <p>
                <strong>Total:</strong> ${order.total.toFixed(2)}
              </p>
              <ul className="mt-2 ml-4 list-disc">
                {order.items.map((item, index) => (
                  <li key={index} className="text-gray-600">
                    {item.name} - {item.quantity} x ${item.price.toFixed(2)}
                  </li>
                ))}
              </ul>
              <p className="text-gray-500 mt-2">
                <strong>Fecha:</strong>{" "}
                {order.createdAt && order.createdAt.toDate
                  ? order.createdAt.toDate().toLocaleString()
                  : "Fecha no disponible"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderHistory;
