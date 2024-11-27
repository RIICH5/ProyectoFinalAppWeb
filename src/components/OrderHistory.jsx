import React, { useState, useEffect } from "react";
import { db } from "../services/firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";

const OrderHistory = ({ userId }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, where("userId", "==", userId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedOrders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(fetchedOrders);
    });

    return () => unsubscribe();
  }, [userId]);

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
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.name} - {item.quantity} x ${item.price.toFixed(2)}
                  </li>
                ))}
              </ul>
              <p className="text-gray-500">
                Fecha: {order.createdAt?.toDate().toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderHistory;
