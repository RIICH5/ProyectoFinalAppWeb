import React, { useContext, useState } from "react";
import { MenuContext } from "../contexts/MenuContext"; // Contexto para datos del menú
import { OrderContext } from "../contexts/OrderContext"; // Contexto para el carrito
import { useLocation } from "react-router-dom"; // Para detectar la ruta actual
import { doc, updateDoc, deleteDoc } from "firebase/firestore"; // Para Firestore
import { db } from "../services/firebaseConfig"; // Configuración de Firebase

export const Item = ({ id, name, description, price, category, available }) => {
  const { menuItems, setMenuItems } = useContext(MenuContext);
  const { cart, addToCart, removeFromCart } = useContext(OrderContext); // Usar el contexto del carrito
  const location = useLocation(); // Ruta actual

  const [isAddingToCart, setIsAddingToCart] = useState(false); // Estado para feedback visual de agregar
  const [isRemovingFromCart, setIsRemovingFromCart] = useState(false); // Estado para feedback visual de quitar

  // Verificar si el producto ya está en el carrito
  const isInCart = (productId) => {
    return cart.some(item => item.id === productId);
  };

  // Cambiar la disponibilidad del producto
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

  // Eliminar producto del menú
  const handleDelete = async () => {
    try {
      const itemDoc = doc(db, "menu", id);
      await deleteDoc(itemDoc); // Eliminar en Firestore
      setMenuItems(menuItems.filter((item) => item.id !== id)); // Actualizar localmente
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
    }
  };

  // Función para manejar la acción de agregar al carrito
  const handleAddToCart = () => {
    if (available) {
      setIsAddingToCart(true); // Activar feedback visual
      addToCart({ id, name, description, price, category, quantity: 1 });
      
      // Restablecer el feedback visual después de un breve período
      setTimeout(() => {
        setIsAddingToCart(false);
      }, 1000);
    }
  };

  // Función para manejar la acción de quitar del carrito
  const handleRemoveFromCart = () => {
    setIsRemovingFromCart(true); // Activar feedback visual
    removeFromCart(id);
    
    // Restablecer el feedback visual después de un breve período
    setTimeout(() => {
      setIsRemovingFromCart(false);
    }, 1000);
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

      {/* Opciones en el panel de administración */}
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

      {/* Botón de agregar o quitar del carrito en la vista del menú */}
      {location.pathname === "/" && (
        <button
          onClick={isInCart(id) ? handleRemoveFromCart : handleAddToCart}
          disabled={!available} // Deshabilitar si no está disponible
          className={`px-4 py-2 mt-2 rounded ${!available ? "bg-gray-500 cursor-not-allowed" : isInCart(id) ? "bg-green-500" : "bg-blue-500"} ${isAddingToCart ? "animate-pulse bg-green-400" : ""} ${isRemovingFromCart ? "animate-pulse bg-red-400" : ""}`}
        >
          {isInCart(id) ? "Quitar del Carrito" : "Agregar al Carrito"}
        </button>
      )}
    </div>
  );
};
