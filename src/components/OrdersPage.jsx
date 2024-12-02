// src/components/OrdersPage.jsx

import React, { useEffect, useState } from "react";
import { db } from "../services/firebaseConfig"; // Asegúrate de importar la configuración de Firebase
import { collection, query, where, onSnapshot, updateDoc, doc } from "firebase/firestore";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para cambiar el estado de una orden
  const updateOrderStatus = async (orderId, status) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: status });
      console.log("Estado de la orden actualizado");
    } catch (error) {
      console.error("Error actualizando el estado de la orden:", error);
    }
  };

  useEffect(() => {
    // Consulta para obtener las órdenes que están activas
    const q = query(collection(db, "orders"), where("status", "in", ["in_progress", "pending"]));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const ordersList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(ordersList);
      setLoading(false);
    });

    return () => unsubscribe(); // Limpiar el listener cuando el componente se desmonte
  }, []);

  if (loading) {
    return (
      <div className="text-center">
        <p className="text-lg text-gray-500">Cargando órdenes activas...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Órdenes Activas</h2>

      {orders.length === 0 ? (
        <p className="text-center text-lg">No hay órdenes activas en este momento.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.id} className="border-b p-4">
              <h3 className="text-xl font-semibold">Pedido #{order.id}</h3>
              <p><strong>Cliente:</strong> {order.userId}</p>
              <ul>
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.name} x {item.quantity} - ${item.price * item.quantity}
                  </li>
                ))}
              </ul>
              <p><strong>Total:</strong> ${order.total}</p>

              <div className="mt-4">
                <strong>Estado:</strong> <span className="font-semibold">{order.status}</span>
              </div>

              <div className="mt-4">
                <button
                  onClick={() => updateOrderStatus(order.id, "completed")}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg mr-2"
                >
                  Marcar como Completado
                </button>
                <button
                  onClick={() => updateOrderStatus(order.id, "cancelled")}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                  Cancelar Orden
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrdersPage;
