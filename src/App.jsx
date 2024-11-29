import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Header } from "./components/Header";
import AdminPanel from "./components/Admin/AdminPanel";
import MenuView from "./components/Menu/MenuView";
import OrderCart from "./components/OrderCart";
import OrderHistory from "./components/OrderHistory";
import { LoginForm } from "./components/LoginForm";
import ProtectedRoute from "./components/ProtectedRoute";
import { MenuProvider } from "./contexts/MenuContext";
import { OrderProvider } from "./contexts/OrderContext";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        setUser(storedUser);
        setIsAuthenticated(true);
        setIsAdmin(storedUser.role === "admin");
      }
      setIsCheckingAuth(false);
    };
    checkAuth();
  }, []);

  if (isCheckingAuth) {
    return <p className="text-center mt-20">Cargando...</p>;
  }

  return (
    <Router>
      <Header
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
      <MenuProvider>
        <OrderProvider>
          <div className="container mx-auto px-4">
            <Routes>
              {/* Ruta de inicio de sesión */}
              <Route
                path="/"
                element={
                  !isAuthenticated ? (
                    <LoginForm
                      setIsAuthenticated={setIsAuthenticated}
                      setIsAdmin={setIsAdmin}
                    />
                  ) : (
                    <Navigate to={isAdmin ? "/admin" : "/menu"} />
                  )
                }
              />

              {/* Rutas protegidas */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated && isAdmin}>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/menu"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <MenuView />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <OrderCart userId={user?.id} />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <OrderHistory userId={user?.id} />
                  </ProtectedRoute>
                }
              />

              {/* Ruta para redirigir rutas desconocidas */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </OrderProvider>
      </MenuProvider>
    </Router>
  );
}

export default App;
