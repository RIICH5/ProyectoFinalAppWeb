
import React, { useContext, useState, useEffect } from "react";
import { MenuContext } from "../../contexts/MenuContext";
import { db } from "../../services/firebaseConfig";
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from "firebase/firestore"; 

export const ManageMenu = () => {
  const { items, setItems } = useContext(MenuContext); // Usamos el contexto
  const [newItem, setNewItem] = useState({ name: "", description: "", price: 0, category: "", image: null });
  const [editItem, setEditItem] = useState(null); // Para la edición de los productos
  const [filterCategory, setFilterCategory] = useState("Todas"); // Filtro de categorías

  // Cargar los elementos del menú al inicio desde Firebase
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const menuCollection = collection(db, "menu");
        const snapshot = await getDocs(menuCollection);
        const menuItems = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setItems(menuItems); // Establece los elementos en el contexto
      } catch (error) {
        console.error("Error al cargar el menú", error);
      }
    };
    fetchItems();
  }, [setItems]);

  // Agregar un producto al menú y a Firebase
  const handleAddItem = async () => {
    if (!newItem.category) {
      alert("Por favor, selecciona una categoría.");
      return;
    }
    try {
      const docRef = await addDoc(collection(db, "menu"), newItem);
      setItems([...items, { ...newItem, id: docRef.id }]); // Agrega el nuevo producto al estado
      setNewItem({ name: "", description: "", price: 0, category: "", image: null }); // Reinicia el formulario
    } catch (error) {
      console.error("Error al agregar el producto", error);
    }
  };

  // Editar un producto en Firebase y en el estado
  const handleEditItem = async () => {
    if (!editItem.category) {
      alert("Por favor, selecciona una categoría.");
      return;
    }
    try {
      const itemDoc = doc(db, "menu", editItem.id);
      await updateDoc(itemDoc, editItem); // Actualiza el producto en Firebase
      setItems(items.map(item => item.id === editItem.id ? editItem : item)); // Actualiza el estado
      setEditItem(null); // Cierra el formulario de edición
    } catch (error) {
      console.error("Error al editar el producto", error);
    }
  };

  // Eliminar un producto de Firebase y del estado
  const handleDeleteItem = async (id) => {
    try {
      const itemDoc = doc(db, "menu", id);
      await deleteDoc(itemDoc); // Elimina el producto de Firebase
      setItems(items.filter(item => item.id !== id)); // Elimina el producto del estado
    } catch (error) {
      console.error("Error al eliminar el producto", error);
    }
  };

  // Filtrar productos por categoría
  const filteredItems =
    filterCategory === "Todas"
      ? items
      : items.filter((item) => item.category === filterCategory);

  return (
    <div className="manage-menu">
      <h2 className="text-xl font-bold mb-4">Gestión de Menú</h2>

      {/* Filtro de Categorías */}
      <div className="mb-4">
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="border p-2 mb-4"
        >
          <option value="Todas">Todas</option>
          <option value="Entradas">Entradas</option>
          <option value="Platos Fuertes">Platos Fuertes</option>
          <option value="Postres">Postres</option>
          <option value="Bebidas">Bebidas</option>
        </select>
      </div>

      {/* Formulario de Agregar Producto */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Nombre"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Descripción"
          value={newItem.description}
          onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
          className="border p-2 mr-2"
        />
        <input
          type="number"
          placeholder="Precio"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) })}
          className="border p-2 mr-2"
        />
        <select
          value={newItem.category}
          onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
          className="border p-2 mr-2"
        >
          <option value="">Seleccionar Categoría</option>
          <option value="Entradas">Entradas</option>
          <option value="Platos Fuertes">Platos Fuertes</option>
          <option value="Postres">Postres</option>
          <option value="Bebidas">Bebidas</option>
        </select>
        <button onClick={handleAddItem} className="bg-blue-500 text-white p-2 rounded">
          Agregar Producto
        </button>
      </div>

      {/* Formulario de Edición */}
      {editItem && (
        <div className="mb-4">
          <h3 className="text-lg font-bold mb-2">Editar Producto</h3>
          <input
            type="text"
            value={editItem.name}
            onChange={(e) => setEditItem({ ...editItem, name: e.target.value })}
            className="border p-2 mr-2"
          />
          <input
            type="text"
            value={editItem.description}
            onChange={(e) => setEditItem({ ...editItem, description: e.target.value })}
            className="border p-2 mr-2"
          />
          <input
            type="number"
            value={editItem.price}
            onChange={(e) => setEditItem({ ...editItem, price: parseFloat(e.target.value) })}
            className="border p-2 mr-2"
          />
          <select
            value={editItem.category}
            onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}
            className="border p-2 mr-2"
          >
            <option value="">Seleccionar Categoría</option>
            <option value="Entradas">Entradas</option>
            <option value="Platos Fuertes">Platos Fuertes</option>
            <option value="Postres">Postres</option>
            <option value="Bebidas">Bebidas</option>
          </select>
          <button onClick={handleEditItem} className="bg-green-500 text-white p-2 rounded">
            Guardar Cambios
          </button>
        </div>
      )}

      {/* Listado de Productos */}
      <div>
        {filteredItems && filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div key={item.id} className="flex justify-between items-center border-b py-2">
              <span>{item.name} - {item.category}</span>
              <button onClick={() => setEditItem(item)} className="bg-yellow-500 text-white p-1 rounded">
                Editar
              </button>
              <button onClick={() => handleDeleteItem(item.id)} className="bg-red-500 text-white p-1 rounded">
                Eliminar
              </button>
            </div>
          ))
        ) : (
          <p>No hay productos en esta categoría.</p>
        )}
      </div>
    </div>
  );
};

export default ManageMenu;
