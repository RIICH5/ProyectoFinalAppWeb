import React, { useContext, useState, useEffect } from "react";
import { MenuContext } from "../../contexts/MenuContext";
import { db } from "../../services/firebaseConfig";
import { collection, getDocs, doc, deleteDoc, addDoc, updateDoc } from "firebase/firestore"; 
import { useNavigate } from "react-router-dom"; 

export const ManageMenu = ({ isAuthenticated, isAdmin }) => {
  const { items, setItems } = useContext(MenuContext); // Usamos el contexto
  const [newItem, setNewItem] = useState({ name: "", description: "", price: 0, category: "", image: null });
  const [editItem, setEditItem] = useState(null); // Para la edición de los productos
  const [loading, setLoading] = useState(true); // Estado de carga
  const navigate = useNavigate(); // Hook para redirigir

  // Evitar ciclos de redirección: si no está autenticado o no es admin, redirigir a login
  useEffect(() => {
    if ((!isAuthenticated || !isAdmin) && window.location.pathname !== "/login") {
      navigate("/login"); // Redirige al login si no está autenticado o no es admin
    }
  }, [isAuthenticated, isAdmin, navigate]); // Solo se dispara cuando `isAuthenticated` o `isAdmin` cambian

  // Cargar los elementos del menú al inicio desde Firebase
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const menuCollection = collection(db, "menu");
        const snapshot = await getDocs(menuCollection);
        const menuItems = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setItems(menuItems); // Establece los elementos en el contexto
        setLoading(false); // Una vez que se cargan los datos, cambiamos el estado de carga
      } catch (error) {
        console.error("Error al cargar el menú", error);
        setLoading(false); // En caso de error también dejamos de cargar
      }
    };

    if (loading) { // Solo realiza la carga si no se ha completado aún
      fetchItems();
    }
  }, [loading, setItems]); // Asegúrate de que solo se ejecute cuando `loading` sea `true`

  // Agregar un producto al menú y a Firebase
  const handleAddItem = async () => {
    try {
      const docRef = await addDoc(collection(db, "menu"), newItem);
      setItems(prevItems => [...prevItems, { ...newItem, id: docRef.id }]); // Agrega el nuevo producto al estado
      setNewItem({ name: "", description: "", price: 0, category: "", image: null }); // Reinicia el formulario
    } catch (error) {
      console.error("Error al agregar el producto", error);
    }
  };

  // Editar un producto en Firebase y en el estado
  const handleEditItem = async () => {
    try {
      const itemDoc = doc(db, "menu", editItem.id);
      await updateDoc(itemDoc, editItem); // Actualiza el producto en Firebase
      setItems(prevItems => prevItems.map(item => item.id === editItem.id ? editItem : item)); // Actualiza el estado
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
      setItems(prevItems => prevItems.filter(item => item.id !== id)); // Elimina el producto del estado
    } catch (error) {
      console.error("Error al eliminar el producto", error);
    }
  };

  return (
    <div className="manage-menu">
      {/* Si no está autenticado o no es admin, mostrar mensaje de acceso denegado */}
      {(!isAuthenticated || !isAdmin) ? (
        <p className="text-red-500">No tienes permisos para acceder a esta sección. Por favor, inicia sesión como administrador.</p>
      ) : (
        <>
          <h2 className="text-xl font-bold mb-4">Gestión de Menú</h2>

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
            <input
              type="text"
              placeholder="Categoría"
              value={newItem.category}
              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              className="border p-2 mr-2"
            />
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
              <input
                type="text"
                value={editItem.category}
                onChange={(e) => setEditItem({ ...editItem, category: e.target.value })}
                className="border p-2 mr-2"
              />
              <button onClick={handleEditItem} className="bg-green-500 text-white p-2 rounded">
                Guardar Cambios
              </button>
            </div>
          )}

          {/* Listado de Productos */}
          <div>
            {loading ? (
              <p>Cargando...</p> // Mensaje mientras los productos se están cargando
            ) : items && items.length > 0 ? (
              items.map((item) => (
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
              <p>No hay productos en el menú.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ManageMenu;
