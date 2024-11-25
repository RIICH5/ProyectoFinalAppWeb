import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Menu } from "./components/Menu";
import { Orders } from "./components/Orders";
import { LoginForm } from "./components/LoginForm";
import AdminPanel from "./components/Admin/AdminPanel"; // Ruta ajustada

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Verificar si el usuario está autenticado y obtener el rol
  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        setUser(storedUser);
        setIsAuthenticated(true);
        // Verificamos si el usuario es admin
        if (storedUser.role === "admin") {
          setIsAdmin(true);
        }
      }
    };
    checkAuth();
  }, []);

  return (
    <Router>
      <Header
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
      {isAuthenticated ? (
        <div className="container mx-auto px-4">
          <Routes>
            {/* Ruta principal del menú */}
            <Route
              path="/"
              element={
                isAdmin ? (
                  <h1 className="text-3xl font-bold">Bienvenido Administrador</h1>
                ) : (
                  <Menu />
                )
              }
            />
            {/* Ruta para el panel administrativo */}
            {isAdmin && (
              <Route
                path="/admin"
                element={<AdminPanel />}
              />
            )}
            {/* Ruta para pedidos */}
            {!isAdmin && (
              <Route
                path="/orders"
                element={<Orders />}
              />
            )}
          </Routes>
        </div>
      ) : (
        <LoginForm
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
        />
      )}
    </Router>
  );
}

export default App;
