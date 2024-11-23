import React, { useState, useEffect } from "react";
import { getOrders } from "../services/orderService";

export const Orders = () => {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    getOrders()
      .then((data) => {
        setOrders(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <h1>Historial de ordenes</h1>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            <h3>Order ID: {order.id}</h3>
            {order.items.map((item, i) => (
              <div key={i}>
                <h4>{item.name}</h4>
                <p>{item.description}</p>
                <p>Price: {item.price}</p>
              </div>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
};
