import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Menu } from "./components/Menu";
import { Orders } from "./components/Orders";
import { LoginForm } from "./components/LoginForm";
import AdminPanel from "./components/Admin/AdminPanel";
import { MenuProvider } from "./contexts/MenuContext"; 
import MenuView from './components/Menu/MenuView'; 
import { OrderProvider } from "./contexts/OrderContext"; // Contexto para pedidos
import OrderCart from "./components/OrderCart"; // Componente del carrito
import OrderHistory from "./components/OrderHistory"; // Componente del historial

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        setUser(storedUser);
        setIsAuthenticated(true);
        setIsAdmin(storedUser.role === "admin");
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
        <MenuProvider>
          <OrderProvider> {/* Encierra las rutas con el contexto de pedidos */}
            <div className="container mx-auto px-4">
              <Routes>
                <Route
                  path="/"
                  element={isAdmin ? <h1 className="text-3xl font-bold">Bienvenido Administrador</h1> : <Menu />}
                />
                {isAdmin && <Route path="/admin" element={<AdminPanel />} />}
                {!isAdmin && (
                  <>
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/cart" element={<OrderCart userId={user?.id} />} /> {/* Carrito */}
                    <Route path="/history" element={<OrderHistory userId={user?.id} />} /> {/* Historial */}
                  </>
                )}
              </Routes>
            </div>
          </OrderProvider>
        </MenuProvider>
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
