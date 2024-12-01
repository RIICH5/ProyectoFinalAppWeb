// Ubicación: services/tableService.js
import { db } from "./firebaseConfig";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";

// Obtener todas las mesas
export const getTables = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "Tables"));
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching tables: ", error);
    throw new Error("Error al obtener las mesas.");
  }
};

// Agregar una nueva mesa
export const addTable = async (table) => {
  try {
    const docRef = await addDoc(collection(db, "Tables"), table);
    console.log("Mesa agregada con ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding table: ", error);
    throw new Error("Error al agregar una nueva mesa.");
  }
};

// Eliminar una mesa
export const deleteTable = async (id) => {
  try {
    const docRef = doc(db, "Tables", id);
    await deleteDoc(docRef);
    console.log("Mesa eliminada con ID: ", id);
  } catch (error) {
    console.error("Error deleting table: ", error);
    throw new Error("Error al eliminar la mesa.");
  }
};

export const updateTable = async (table) => {
    try {
      const docRef = db.collection("tables").doc(table.id);
      await docRef.update({
        tableNumber: table.tableNumber,
        status: table.status,
      });
    } catch (error) {
      console.error("Error updating table:", error);
    }
  };