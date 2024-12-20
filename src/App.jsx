import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Header } from "./components/Header";
import AdminPanel from "./components/Admin/AdminPanel";
import MenuView from "./components/Menu/MenuView";
import OrderCart from "./components/OrderCart";
import OrderHistory from "./components/OrderHistory";
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";
import ProtectedRoute from "./components/ProtectedRoute";
import { MenuProvider } from "./contexts/MenuContext";
import { OrderProvider } from "./contexts/OrderContext";
import CheckoutPage from "./components/Checkout/CheckoutPage";
import PaymentSuccess from "./components/Checkout/PaymentSuccess";
import PaymentFailure from "./components/Checkout/PaymentFailure";
import OrdersPage from "./components/OrdersPage";
import TrackingOrder from "./components/TrackingOrder";

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
        setIsAdmin(storedUser.role === "admin"); // Asignar true si el rol es admin
      }
      setIsCheckingAuth(false);
    };
    checkAuth();
  }, []);

  // Muestra una pantalla de carga mientras se verifica la autenticación
  if (isCheckingAuth) {
    return <p className="text-center mt-20">Cargando...</p>;
  }

  return (
    <MenuProvider>
      <OrderProvider>
        <Router>
          <Header
            isAdmin={isAdmin}
            setIsAdmin={setIsAdmin}
            isAuthenticated={isAuthenticated}
            setIsAuthenticated={setIsAuthenticated}
          />
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

              {/* Ruta para registrar un nuevo usuario */}
              <Route
                path="/register"
                element={<RegisterForm />}
              />

              {/* Rutas protegidas con el rol de admin */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />

              {/* Rutas protegidas para usuarios autenticados */}
              <Route
                path="/menu"
                element={
                  <ProtectedRoute requiredRole="user">
                    <MenuView />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/tracking-order"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <TrackingOrder userId={user?.id} />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/cart"
                element={
                  <ProtectedRoute requiredRole="user">
                    <OrderCart userId={user?.id} />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/history"
                element={
                  <ProtectedRoute requiredRole="user">
                    <OrderHistory userId={user?.id} />
                  </ProtectedRoute>
                }
              />

              {/* Rutas de checkout */}
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/payment-failure" element={<PaymentFailure />} />

              {/* Ruta de pedidos */}
              <Route path="/orders" element={<OrdersPage />} />

              {/* Ruta para redirigir rutas desconocidas */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </Router>
      </OrderProvider>
    </MenuProvider>
  );
}

export default App;
