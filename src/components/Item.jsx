import React, { useContext } from "react";
import { MenuContext } from "../contexts/MenuContext"; 
import { useLocation } from "react-router-dom"; 

export const Item = ({ id, name, description, price, category, status, imageUrl }) => {
  const { menuItems, setMenuItems } = useContext(MenuContext);
  const location = useLocation(); 

  const handleEdit = () => {
    const updatedItem = { id, name, description, price: price + 1, category, status, imageUrl };
    setMenuItems(menuItems.map(item => (item.id === id ? updatedItem : item)));
  };

  const handleDelete = () => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  return (
    <div className="border p-4 mb-4">
      <h2 className="text-xl font-bold">{name}</h2>
      <p>{description}</p>
      <p className="text-gray-600">Precio: ${price}</p>
      <p className={`text-sm ${status === "available" ? "text-green-600" : "text-red-600"}`}>
        {status === "available" ? "Disponible" : "Agotado"}
      </p>
      <p className="text-gray-500">Categoría: {category}</p>

      {/* Mostrar imagen solo si hay una URL de imagen */}
      {imageUrl && <img src={imageUrl} alt={name} className="mt-2 w-full h-auto" />}

      {/* Solo mostrar los botones si estamos en el panel de administración */}
      {location.pathname === "/admin" && (
        <>
          <button onClick={handleEdit} className="mt-2 text-blue-500">
            Editar
          </button>
          <button onClick={handleDelete} className="mt-2 text-red-500">
            Eliminar
          </button>
        </>
      )}
    </div>
  );
};
