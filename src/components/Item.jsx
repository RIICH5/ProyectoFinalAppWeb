import React, { useContext } from "react";
import { MenuContext } from "../contexts/MenuContext"; // Contexto para datos del menú
import { useLocation } from "react-router-dom"; // Para detectar la ruta actual
import { doc, updateDoc, deleteDoc } from "firebase/firestore"; // Para Firestore
import { db } from "../services/firebaseConfig"; // Configuración de Firebase

export const Item = ({ id, name, description, price, category, available }) => {
  const { menuItems, setMenuItems } = useContext(MenuContext);
  const location = useLocation(); // Ruta actual

  const handleToggleAvailability = async () => {
    try {
      const itemDoc = doc(db, "menu", id);
      await updateDoc(itemDoc, { available: !available }); // Cambiar en Firestore
      setMenuItems(
        menuItems.map((item) =>
          item.id === id ? { ...item, available: !available } : item
        )
      ); // Actualizar localmente
    } catch (error) {
      console.error("Error al cambiar la disponibilidad:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const itemDoc = doc(db, "menu", id);
      await deleteDoc(itemDoc); // Eliminar en Firestore
      setMenuItems(menuItems.filter((item) => item.id !== id)); // Actualizar localmente
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  return (
    <div className="border p-4 mb-4">
      <h2 className="text-xl font-bold">{name}</h2>
      <p>{description}</p>
      <p className="text-gray-600">Precio: ${price.toFixed(2)}</p>
      <p className={`text-sm ${available ? "text-green-600" : "text-red-600"}`}>
        {available ? "Disponible" : "Agotado"}
      </p>
      <p className="text-gray-500">Categoría: {category}</p>

      {/* Solo muestra los botones si estamos en el panel de administración */}
      {location.pathname === "/admin" && (
        <div className="flex gap-4 mt-4">
          <button
            onClick={handleToggleAvailability}
            className="text-blue-500 border p-2 rounded"
          >
            {available ? "Marcar como Agotado" : "Marcar como Disponible"}
          </button>
          <button
            onClick={handleDelete}
            className="text-red-500 border p-2 rounded"
          >
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
};
