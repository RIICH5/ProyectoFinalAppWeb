import React, { useState, useEffect } from "react";
import { getMenuItems, addMenuItem, deleteMenuItem, updateMenuItem } from "../../services/menuService";
import { storage } from "../../services/firebaseConfig"; // Ahora se importa 'storage' correctamente
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const ManageMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [newMenuItem, setNewMenuItem] = useState({
    name: "",
    description: "",
    price: "",
    category: "entrada", // Categoría por defecto
    available: true,
    image: null,
  });
  const [editMenuItem, setEditMenuItem] = useState(null); // Estado para el producto que se está editando

  // Fetch menu items on mount
  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    const items = await getMenuItems();
    setMenuItems(items);
  };

  const handleAddMenuItem = async () => {
    if (newMenuItem.image) {
      // Subir la imagen a Firebase Storage
      const imageRef = ref(storage, `menuImages/${newMenuItem.image.name}`);
      await uploadBytes(imageRef, newMenuItem.image);
      const imageUrl = await getDownloadURL(imageRef); // Obtener la URL de la imagen

      const menuItemWithImage = {
        ...newMenuItem,
        image: imageUrl,
      };
      await addMenuItem(menuItemWithImage);
    } else {
      await addMenuItem(newMenuItem);
    }

    fetchMenuItems(); // Refresh list
    setNewMenuItem({ name: "", description: "", price: "", category: "entrada", available: true, image: null });
  };

  const handleDeleteMenuItem = async (id) => {
    await deleteMenuItem(id);
    fetchMenuItems();
  };

  const handleEditMenuItem = (item) => {
    setEditMenuItem(item); // Pre-cargar los datos del producto en el formulario de edición
  };

  const handleSaveEditMenuItem = async () => {
    if (editMenuItem.image) {
      const imageRef = ref(storage, `menuImages/${editMenuItem.image.name}`);
      await uploadBytes(imageRef, editMenuItem.image);
      const imageUrl = await getDownloadURL(imageRef);
      await updateMenuItem({ ...editMenuItem, image: imageUrl });
    } else {
      await updateMenuItem(editMenuItem);
    }
    fetchMenuItems(); // Refrescar lista
    setEditMenuItem(null); // Cerrar el formulario de edición
  };

  return (
    <div className="manage-menu">
      <h2 className="text-xl font-bold mb-4">Gestión de Menú</h2>

      {/* Formulario para Agregar Producto */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Nombre"
          value={newMenuItem.name}
          onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Descripción"
          value={newMenuItem.description}
          onChange={(e) => setNewMenuItem({ ...newMenuItem, description: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="number"
          placeholder="Precio"
          value={newMenuItem.price}
          onChange={(e) => setNewMenuItem({ ...newMenuItem, price: e.target.value })}
          className="border p-2 mr-2"
        />
        <select
          value={newMenuItem.category}
          onChange={(e) => setNewMenuItem({ ...newMenuItem, category: e.target.value })}
          className="border p-2 mr-2"
        >
          <option value="entrada">Entrada</option>
          <option value="plato_fuerte">Plato Fuerte</option>
          <option value="postre">Postre</option>
          <option value="bebida">Bebida</option>
        </select>
        <div>
          <label>
            <input
              type="checkbox"
              checked={newMenuItem.available}
              onChange={(e) => setNewMenuItem({ ...newMenuItem, available: e.target.checked })}
              className="mr-2"
            />
            Disponible
          </label>
        </div>
        <input
          type="file"
          onChange={(e) => setNewMenuItem({ ...newMenuItem, image: e.target.files[0] })}
          className="border p-2 mr-2"
        />
        <button onClick={handleAddMenuItem} className="bg-blue-500 text-white p-2 rounded">
          Agregar Producto
        </button>
      </div>

      {/* Formulario de Edición */}
      {editMenuItem && (
        <div className="mb-4">
          <h3 className="text-lg font-bold mb-2">Editar Producto</h3>
          <input
            type="text"
            value={editMenuItem.name}
            onChange={(e) => setEditMenuItem({ ...editMenuItem, name: e.target.value })}
            className="border p-2 mr-2"
          />
          <input
            type="text"
            value={editMenuItem.description}
            onChange={(e) => setEditMenuItem({ ...editMenuItem, description: e.target.value })}
            className="border p-2 mr-2"
          />
          <input
            type="number"
            value={editMenuItem.price}
            onChange={(e) => setEditMenuItem({ ...editMenuItem, price: e.target.value })}
            className="border p-2 mr-2"
          />
          <select
            value={editMenuItem.category}
            onChange={(e) => setEditMenuItem({ ...editMenuItem, category: e.target.value })}
            className="border p-2 mr-2"
          >
            <option value="entrada">Entrada</option>
            <option value="plato_fuerte">Plato Fuerte</option>
            <option value="postre">Postre</option>
            <option value="bebida">Bebida</option>
          </select>
          <div>
            <label>
              <input
                type="checkbox"
                checked={editMenuItem.available}
                onChange={(e) => setEditMenuItem({ ...editMenuItem, available: e.target.checked })}
                className="mr-2"
              />
              Disponible
            </label>
          </div>
          <input
            type="file"
            onChange={(e) => setEditMenuItem({ ...editMenuItem, image: e.target.files[0] })}
            className="border p-2 mr-2"
          />
          <button onClick={handleSaveEditMenuItem} className="bg-green-500 text-white p-2 rounded">
            Guardar Cambios
          </button>
        </div>
      )}

      {/* Lista de Productos */}
      <ul>
        {menuItems.map((item) => (
          <li key={item.id} className="flex justify-between items-center border-b py-2">
            <span>
              {item.name} - ${item.price} - {item.available ? "Disponible" : "Agotado"}
              {item.image && <img src={item.image} alt={item.name} className="w-16 h-16 object-cover ml-2" />}
            </span>
            <button
              onClick={() => handleEditMenuItem(item)} // Llamada al formulario de edición
              className="bg-yellow-500 text-white p-1 rounded"
            >
              Editar
            </button>
            <button
              onClick={() => handleDeleteMenuItem(item.id)}
              className="bg-red-500 text-white p-1 rounded"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageMenu;
