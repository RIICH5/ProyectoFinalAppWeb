import React, { useEffect, useState } from "react";
import { db } from "../services/firebaseConfig";  // Asegúrate de tener la configuración correcta de Firebase
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Para obtener el ID del usuario autenticado
import { useNavigate } from "react-router-dom"; 

const TrackingOrder = () => {
  const [order, setOrder] = useState(null); // Estado para almacenar el pedido completo
  const [loading, setLoading] = useState(true); // Estado para carga
  const navigate = useNavigate();
  
  const auth = getAuth(); // Accedemos a la autenticación de Firebase
  const user = auth.currentUser;  // Obtenemos el usuario autenticado
  const userId = user ? user.uid : null;  // Usamos el UID del usuario autenticado

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      setOrder({ status: "No estás autenticado." });
      return;
    }

    // Consultamos el estado de las órdenes de este usuario
    const q = query(collection(db, "orders"), where("userId", "==", userId));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      if (!querySnapshot.empty) {
        const orderData = querySnapshot.docs[0].data(); // Suponemos que hay un único pedido por usuario
        setOrder(orderData); // Actualizamos con toda la información del pedido
      } else {
        setOrder({ status: "No tienes ningún pedido activo" }); // Si no hay pedido para este usuario
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Limpiar listener cuando el componente se desmonte
  }, [userId]); // Dependencia: se ejecuta cada vez que el userId cambia

  if (loading) {
    return (
      <div className="text-center">
        <p className="text-lg text-gray-500">Cargando estado del pedido...</p>
      </div>
    );
  }

  // Si no hay pedido o el usuario no está autenticado
  if (order.status === "No tienes ningún pedido activo" || order.status === "No estás autenticado.") {
    return (
      <div className="text-center">
        <p className="text-lg text-gray-500">{order.status}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Seguimiento de Pedido</h2>

      <div className="mt-4">
        <strong>Estado del Pedido:</strong>
        <p className="font-semibold">{order.status}</p>
      </div>

      {/* Mostrar detalles del pedido */}
      <div className="mt-6">
        <h3 className="text-xl font-bold text-gray-800">Detalles del Pedido</h3>
        <ul className="space-y-4 mt-4">
          {order.items && order.items.map((item, index) => (
            <li key={index} className="flex justify-between">
              <span>{item.name} x {item.quantity}</span>
              <span>${item.price * item.quantity}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Mostrar Total */}
      <div className="mt-6">
        <strong>Total:</strong>
        <p className="font-semibold">${order.total}</p>
      </div>

      {/* Mostrar fechas si están disponibles */}
      {order.createdAt && (
        <div className="mt-4">
          <strong>Fecha de Creación:</strong>
          <p>{new Date(order.createdAt.seconds * 1000).toLocaleString()}</p>
        </div>
      )}

      {order.updatedAt && (
        <div className="mt-4">
          <strong>Última Actualización:</strong>
          <p>{new Date(order.updatedAt.seconds * 1000).toLocaleString()}</p>
        </div>
      )}

      {/* Botón para volver al menú */}
      <div className="mt-4">
        <button
          onClick={() => navigate("/menu")} // Navega a la página del menú si el usuario lo desea
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
        >
          Volver al Menú
        </button>
      </div>
    </div>
  );
};

export default TrackingOrder;
