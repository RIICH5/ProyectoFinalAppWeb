import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { db } from "./firebaseConfig";

const auth = getAuth();

// Register a new user
const registerUser = async (email, password, isAdmin = true) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Guardar información del usuario en Firestore
    const userDocRef = doc(db, "Users", user.uid);
    await setDoc(userDocRef, {
      email: user.email,
      role: isAdmin ? "admin" : "user", // Asignar el rol de admin o user
    });

    console.log("User registered: ", userCredential.user.uid);
    return { user: userCredential.user, error: null };
  } catch (error) {
    console.error("Error registering user: ", error.message);
    return { user: null, error: error.message };
  }
};

// Login a user
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("User logged in: ", userCredential.user.uid);
    const userDocRef = doc(db, "Users", userCredential.user.uid);
    const userDoc = await getDoc(userDocRef);
    /*if (userDoc.exists()) {
      console.log("User data:", userDoc.data());
      return { user: userDoc.data(), error: null };
    } else {
      console.log("No user data found!");
      return { user: null, error: "User data not found" };
    }*/
    console.log("User data: ", userDoc.data());

    return { user: userCredential.user, error: null };
  } catch (error) {
    console.error("Error logging in user: ", error.message);
    return { user: null, error: error.message };
  }
};

// Logout a user
const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log("User logged out");
    return { user: null, error: null };
  } catch (error) {
    console.error("Error logging out user: ", error.message);
    return { error: error.message };
  }
};


export { registerUser, loginUser, logoutUser };