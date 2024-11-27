import React, { useState, useEffect } from "react";
import { db } from "../services/firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const OrderHistory = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // Indicador de carga
  const [error, setError] = useState(null); // Manejo de errores

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

  if (loading) return <p>Cargando historial de pedidos...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold">Historial de Pedidos</h2>
      {orders.length === 0 ? (
        <p>No tienes pedidos anteriores.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id} className="border p-4 mb-4">
              <p>
                <strong>Pedido:</strong> {order.id}
              </p>
              <p>
                <strong>Total:</strong> ${order.total.toFixed(2)}
              </p>
              <ul>
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.name} - {item.quantity} x ${item.price.toFixed(2)}
                  </li>
                ))}
              </ul>
              <p className="text-gray-500">
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
