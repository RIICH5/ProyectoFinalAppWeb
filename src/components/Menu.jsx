import React, { useState, useEffect, useContext } from "react";
import { Item } from "./Item";
import { MenuContext } from "../contexts/MenuContext";
import { useLocation } from "react-router-dom";
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";
import { app } from "../services/firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const db = getFirestore(app);
const storage = getStorage(app);

export const Menu = () => {
  const menuContext = useContext(MenuContext);

  // Validar si el contexto está disponible
  if (!menuContext) {
    console.error("MenuContext no está definido. Asegúrate de envolver tu aplicación con MenuProvider.");
    return <p>Error: No se pudo cargar el menú. Por favor, intenta de nuevo más tarde.</p>;
  }

  const { items, setItems, categories, setCategories } = menuContext;

  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newItem, setNewItem] = useState({ name: "", description: "", price: "", category: "", imageUrl: "" });
  const [editingItem, setEditingItem] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const location = useLocation();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const menuItems = await fetchMenuFromFirebase();
        setItems(menuItems);
        setCategories([...new Set(menuItems.map((item) => item.category))]);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar productos:", error);
        setLoading(false);
      }
    };

    fetchItems();
  }, [setItems, setCategories]);

  const handleAddItem = async () => {
    let imageUrl = newItem.imageUrl;
    if (imageFile) {
      const imageRef = ref(storage, `images/${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      imageUrl = await getDownloadURL(imageRef);
    }

    const newItemWithImage = { ...newItem, imageUrl };
    const docRef = await addDoc(collection(db, "menu"), newItemWithImage);
    setItems((prevItems) => [...prevItems, { ...newItemWithImage, id: docRef.id }]);
    setNewItem({ name: "", description: "", price: "", category: "", imageUrl: "" });
    setImageFile(null);
  };

  const handleUpdateItem = async () => {
    let imageUrl = editingItem.imageUrl;
    if (imageFile) {
      const imageRef = ref(storage, `images/${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      imageUrl = await getDownloadURL(imageRef);
    }

    const updatedItem = { ...editingItem, imageUrl };
    const itemDoc = doc(db, "menu", updatedItem.id);
    await updateDoc(itemDoc, updatedItem);
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === editingItem.id ? updatedItem : item))
    );
    setEditingItem(null);
    setImageFile(null);
  };

  const handleDeleteItem = (id) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    const storageRef = ref(storage, `images/${file.name}`);
    await uploadBytes(storageRef, file);
    const imageUrl = await getDownloadURL(storageRef);
    setNewItem((prev) => ({ ...prev, imageUrl }));
  };

  return (
    <>
      <h1 className="text-3xl font-bold">Menú</h1>

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
      ) : items && items.length > 0 ? (
        items.map((item) => (
          <Item
            key={item.id}
            {...item}
            onEdit={location.pathname === "/admin" ? () => setEditingItem(item) : null}
            onDelete={location.pathname === "/admin" ? () => handleDeleteItem(item.id) : null}
          />
        ))
      ) : (
        <h3>No hay productos disponibles en el menú.</h3>
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
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
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

async function fetchMenuFromFirebase() {
  const menuCollection = collection(db, "menu");
  const snapshot = await getDocs(menuCollection);
  return snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
}

export default Menu;
