import React, { useState, useEffect } from "react";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../services/firebaseConfig";  // Asegúrate de tener la configuración correcta de Firebase

const TrackingOrder = ({ userId }) => {
  const [orderStatus, setOrderStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderStatus = async () => {
      // Supongamos que tienes una colección de pedidos con el id de usuario
      const orderRef = doc(db, "Orders", userId); // Aquí asumimos que 'Orders' tiene un campo 'userId' relacionado
      const orderDoc = await getDoc(orderRef);
      
      if (orderDoc.exists()) {
        const orderData = orderDoc.data();
        setOrderStatus(orderData.status);  // Asumimos que tienes un campo 'status' con los valores "en preparación", "listo", "entregado"
      } else {
        setOrderStatus("No encontrado");
      }
      
      setLoading(false);
    };

    if (userId) {
      fetchOrderStatus();
    }
  }, [userId]);

  if (loading) {
    return <div>Cargando estado del pedido...</div>;
  }

  return (
    <div>
      <h2>Estado del Pedido</h2>
      <p>{orderStatus ? `Estado: ${orderStatus}` : "No hay pedidos registrados"}</p>
    </div>
  );
};

export default TrackingOrder;
