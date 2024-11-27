import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Header } from "./components/Header";
import { Menu } from "./components/Menu";
import { Orders } from "./components/Orders";
import { LoginForm } from "./components/LoginForm";
import AdminPanel from "./components/Admin/AdminPanel";
import { MenuProvider } from "./contexts/MenuContext";
import RegisterForm from "./components/RegisterForm"; // Formulario de registro

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Revisa si hay un usuario autenticado en localStorage
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      console.log("Datos recuperados de localStorage:", storedUser); // Depuración
      if (storedUser) {
        setUser(storedUser);
        setIsAuthenticated(true);
        setIsAdmin(storedUser.role === "admin");
      }
    };
    checkAuth();
  }, []);

  // Guarda el estado de autenticación en localStorage
  useEffect(() => {
    if (isAuthenticated && user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [isAuthenticated, user]);

  // Función para manejar el login
  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setIsAdmin(userData.role === "admin");
  };

  // Función para manejar el logout
  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    localStorage.removeItem("user");
  };

  return (
    <Router>
      <MenuProvider>
        <Header
          isAdmin={isAdmin}
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated} 
          handleLogout={handleLogout} // Pasa la función handleLogout al Header
        />
        <div className="container mx-auto px-4">
          <Routes>
            {/* Ruta para el login */}
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to={isAdmin ? "/admin" : "/"} replace />
                ) : (
                  <LoginForm 
                  handleLogin={handleLogin} 
                  setIsAuthenticated={setIsAuthenticated} 
                  setIsAdmin={setIsAdmin}
                  />
                )
              }
            />
            {/* Ruta para el registro */}
            <Route
              path="/register"
              element={
                isAuthenticated ? (
                  <Navigate to={isAdmin ? "/admin" : "/"} replace />
                ) : (
                  <RegisterForm handleLogin={handleLogin} />
                )
              }
            />
            {/* Ruta protegida para el menú (usuarios no administradores) */}
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  isAdmin ? (
                    <Navigate to="/admin" replace />
                  ) : (
                    <Menu />
                  )
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            {/* Ruta protegida para el panel de administrador */}
            <Route
              path="/admin"
              element={
                isAuthenticated && isAdmin ? (
                  <AdminPanel />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            {/* Ruta protegida para pedidos (usuarios no administradores) */}
            <Route
              path="/orders"
              element={
                isAuthenticated && !isAdmin ? (
                  <Orders />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>
        </div>
      </MenuProvider>
    </Router>
  );
}

export default App;
