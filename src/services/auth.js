import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

const auth = getAuth();

/**
 * Registrar un nuevo usuario
 * @param {string} email
 * @param {string} password
 * @param {boolean} isAdmin
 * @returns {object} { user, error }
 */
const registerUser = async (email, password, isAdmin = false) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Guardar información del usuario en Firestore
    const userDocRef = doc(db, "Users", user.uid);
    await setDoc(userDocRef, {
      email: user.email,
      role: isAdmin ? "admin" : "user", // Asignar el rol de admin o user
    });

    console.log("Usuario registrado: ", user.uid);
    return { user: userCredential.user, error: null };
  } catch (error) {
    console.error("Error al registrar usuario: ", error.message);
    return { user: null, error: error.message };
  }
};

/**
 * Iniciar sesión de un usuario
 * @param {string} email
 * @param {string} password
 * @returns {object} { user, error }
 */
const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Obtener el rol del usuario desde Firestore
    const userDocRef = doc(db, "Users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log("Datos del usuario:", userData);
      return { user: { ...user, role: userData.role }, error: null };
    } else {
      console.error("No se encontraron datos del usuario.");
      return { user: null, error: "No se encontraron datos del usuario." };
    }
  } catch (error) {
    console.error("Error al iniciar sesión: ", error.message);
    return { user: null, error: error.message };
  }
};

/**
 * Cerrar sesión de un usuario
 * @returns {object} { error }
 */
const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log("Usuario cerrado sesión.");
    return { error: null };
  } catch (error) {
    console.error("Error al cerrar sesión: ", error.message);
    return { error: error.message };
  }
};

export { registerUser, loginUser, logoutUser };
