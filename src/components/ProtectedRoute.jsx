import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../services/firebaseConfig";  // Importa correctamente tu configuración de Firebase

const ProtectedRoute = ({ children, requiredRole }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchRole = async () => {
      if (currentUser) {
        // Obtener los datos del usuario desde Firestore
        const userDocRef = doc(db, "Users", currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserRole(userData.role);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    fetchRole();
  }, [currentUser]);  // Agregar currentUser como dependencia para evitar bucles infinitos

  if (loading) {
    // Mostrar un mensaje de carga si es necesario
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || (requiredRole && userRole !== requiredRole)) {
    // Si el usuario no está autenticado o no tiene el rol correcto, redirige
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
