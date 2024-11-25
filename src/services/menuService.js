// Ubicación: services/menuService.js
import { db } from "./firebaseConfig";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";

// Obtener todos los elementos del menú
export const getMenuItems = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "Menu"));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching menu items: ", error);
    throw new Error("Error al obtener los elementos del menú.");
  }
};

// Agregar un nuevo elemento al menú
export const addMenuItem = async (menuItem) => {
  try {
    const docRef = await addDoc(collection(db, "Menu"), menuItem);
    console.log("Elemento agregado con ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding menu item: ", error);
    throw new Error("Error al agregar un nuevo elemento al menú.");
  }
};

// Eliminar un elemento del menú
export const deleteMenuItem = async (id) => {
  try {
    const docRef = doc(db, "Menu", id);
    await deleteDoc(docRef);
    console.log("Elemento eliminado con ID: ", id);
  } catch (error) {
    console.error("Error deleting menu item: ", error);
    throw new Error("Error al eliminar el elemento del menú.");
  }
};

// Actualizar un elemento del menú
export const updateMenuItem = async (item) => {
  try {
    const docRef = doc(db, "Menu", item.id); // Corregido: usamos la función `doc` con la sintaxis modular
    await updateDoc(docRef, {
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      available: item.available,
    });
    console.log("Elemento actualizado con ID: ", item.id);
  } catch (error) {
    console.error("Error updating menu item:", error);
    throw new Error("Error al actualizar el elemento del menú.");
  }
};
