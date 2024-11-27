import React, { useState, useEffect, useContext } from "react";
import { Item } from "./Item";
import { MenuContext } from "../contexts/MenuContext";
import { useLocation } from "react-router-dom";  // Importa useLocation
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "../services/firebaseConfig"; // Asegúrate de que la ruta sea correcta

const db = getFirestore(app);

export const Menu = () => {
  const { items, setItems, categories, setCategories } = useContext(MenuContext);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(""); 
  const [newItem, setNewItem] = useState({ name: "", description: "", price: "", category: "" });
  const [editingItem, setEditingItem] = useState(null);
  
  // Usamos useLocation para obtener la ruta actual
  const location = useLocation();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const menuItems = await fetchMenuFromFirebase();  // Llama a la función para cargar productos de Firebase
        setItems(menuItems);  // Guarda los productos en el estado de items
        setCategories([...new Set(menuItems.map(item => item.category))]);  // Actualiza las categorías
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar productos:", error);
        setLoading(false);
      }
    };

    fetchItems();
  }, [setItems, setCategories]);

  const filteredItems = selectedCategory
    ? items.filter(item => item.category === selectedCategory)
    : items;

  const handleAddItem = () => {
    const newId = Math.max(...items.map(item => item.id), 0) + 1;
    const newItemWithId = { ...newItem, id: newId };
    setItems(prevItems => [...prevItems, newItemWithId]);
    setNewItem({ name: "", description: "", price: "", category: "" });
  };

  const handleUpdateItem = () => {
    setItems(prevItems =>
      prevItems.map(item => (item.id === editingItem.id ? editingItem : item))
    );
    setEditingItem(null);
  };

  const handleDeleteItem = (id) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  return (
    <>
      <h1 className="text-3xl font-bold">Menu</h1>

      {/* Filtro de Categorías */}
      <div className="my-4">
        <label className="mr-2">Filtrar por categoría:</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border p-2"
        >
          <option value="">Todas</option>
          {categories && categories.length > 0 ? (
            categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))
          ) : (
            <option disabled>No hay categorías disponibles</option>
          )}
        </select>
      </div>

      {loading ? (
        <h3 className="text-xl">Cargando...</h3>
      ) : (
        items && items.length > 0 ? (
          filteredItems.map((item) => (
            <Item
              key={item.id}
              {...item}
              // Mostrar botones solo si estamos en el panel de administración
              onEdit={location.pathname === "/admin" ? () => setEditingItem(item) : null}
              onDelete={location.pathname === "/admin" ? () => handleDeleteItem(item.id) : null}
            />
          ))
        ) : (
          <h3>No hay productos disponibles en el menú.</h3>
        )
      )}

      {/* Solo muestra este formulario si la ruta es /admin */}
      {location.pathname === "/admin" && (
        <div className="my-6">
          <h2 className="text-2xl">{editingItem ? "Editar Producto" : "Agregar Producto"}</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              editingItem ? handleUpdateItem() : handleAddItem();
            }}
            className="flex flex-col gap-4"
          >
            <input
              type="text"
              placeholder="Nombre"
              value={editingItem ? editingItem.name : newItem.name}
              onChange={(e) => {
                const value = e.target.value;
                editingItem
                  ? setEditingItem({ ...editingItem, name: value })
                  : setNewItem({ ...newItem, name: value });
              }}
              className="border p-2"
            />
            <textarea
              placeholder="Descripción"
              value={editingItem ? editingItem.description : newItem.description}
              onChange={(e) => {
                const value = e.target.value;
                editingItem
                  ? setEditingItem({ ...editingItem, description: value })
                  : setNewItem({ ...newItem, description: value });
              }}
              className="border p-2"
            />
            <input
              type="number"
              placeholder="Precio"
              value={editingItem ? editingItem.price : newItem.price}
              onChange={(e) => {
                const value = e.target.value;
                editingItem
                  ? setEditingItem({ ...editingItem, price: value })
                  : setNewItem({ ...newItem, price: value });
              }}
              className="border p-2"
            />
            <input
              type="text"
              placeholder="Categoría"
              value={editingItem ? editingItem.category : newItem.category}
              onChange={(e) => {
                const value = e.target.value;
                editingItem
                  ? setEditingItem({ ...editingItem, category: value })
                  : setNewItem({ ...newItem, category: value });
              }}
              className="border p-2"
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
              {editingItem ? "Actualizar Producto" : "Agregar Producto"}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

// Esta función de ejemplo es donde deberías implementar la lógica para cargar los productos desde Firebase
async function fetchMenuFromFirebase() {
  const menuCollection = collection(db, "menu");
  const snapshot = await getDocs(menuCollection);
  return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
}

export default Menu;
