import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../services/firebaseConfig";  // Asegúrate de que esta ruta sea correcta

const ProtectedRoute = ({ children, requiredRole }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Si el usuario está autenticado, obtenemos su rol desde Firestore
        try {
          const userDocRef = doc(db, "Users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserRole(userData.role);
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } catch (error) {
          console.error("Error al obtener los datos del usuario:", error);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      
      setLoading(false);  // Al terminar la carga, cambia el estado
    });

    // Cleanup function para cancelar la suscripción
    return () => unsubscribe();
  }, []);


  if (!isAuthenticated || (requiredRole && userRole !== requiredRole)) {
    // Si el usuario no está autenticado o no tiene el rol correcto, redirige
    return <Navigate to="/" />;
  }

  // Si el usuario está autenticado y tiene el rol correcto, renderiza los hijos
  return children;
};

export default ProtectedRoute;
