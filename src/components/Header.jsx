import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { OrderContext } from "../contexts/OrderContext";

export const Header = ({
  isAdmin,
  setIsAdmin,
  isAuthenticated,
  setIsAuthenticated,
}) => {
  const { cart } = useContext(OrderContext); // Accede al carrito
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Estado del menú móvil

  const handleUserToggle = () => {
    setIsAdmin(!isAdmin);
    navigate(isAdmin ? "/menu" : "/admin");
  };

  const handleLogout = async () => {
    setIsAuthenticated(false);
    navigate("/"); // Redirige al inicio de sesión
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen); // Alternar estado del menú móvil
  };

  return (
    <header className="bg-gray-800 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 flex justify-between items-center py-4">
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          className="cursor-pointer text-2xl font-bold tracking-wide text-indigo-300 hover:text-indigo-500"
        >
          Restaurante
        </div>

        {/* Navegación en escritorio */}
        <nav className="hidden md:flex space-x-6">
          {isAuthenticated && (
            <>
              <button
                onClick={() => navigate("/history")}
                className="hover:text-indigo-400 transition-colors"
              >
                Historial de Pedidos
              </button>
              {/* Ícono del carrito en computadoras */}
              <button
                onClick={() => navigate("/cart")}
                className="relative hover:text-indigo-400 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.6 8h11.2l-1.6-8M13 9h1m-6 0h1"
                  />
                </svg>
                {cart.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                    {cart.length}
                  </span>
                )}
              </button>
            </>
          )}
        </nav>

        {/* Controles */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              {/* Aquí ya no está el botón rojo de "Cerrar Sesión" fuera del menú de hamburguesa */}
            </>
          ) : (
            <button
              onClick={() => navigate("/")}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition"
            >
              Iniciar Sesión
            </button>
          )}
        </div>

        {/* Menú móvil */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMobileMenu}
            className="text-white hover:text-indigo-400 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-700 text-white py-4">
          {isAdmin ? (
            // Menú para Admin
            <>
              <button
                onClick={() => navigate("/admin")}
                className="block px-4 py-2 w-full text-left hover:bg-gray-600"
              >
                Panel Administrativo
              </button>
              {/* El botón de Cerrar Sesión solo estará en el menú de hamburguesa para Admin */}
              <button
                onClick={handleLogout}
                className="block px-4 py-2 w-full text-left hover:bg-gray-600"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            // Menú para usuario normal
            <>
              <button
                onClick={() => navigate("/menu")}
                className="block px-4 py-2 w-full text-left hover:bg-gray-600"
              >
                Menú
              </button>
              <button
                onClick={() => navigate("/history")}
                className="block px-4 py-2 w-full text-left hover:bg-gray-600"
              >
                Historial de Pedidos
              </button>
              <button
                onClick={() => navigate("/cart")}
                className="block px-4 py-2 w-full text-left hover:bg-gray-600"
              >
                Carrito de Compras
              </button>
              {/* Aquí añadimos la opción de "Seguimiento de Pedido" solo para usuarios autenticados */}
              <button
                onClick={() => navigate("/tracking-order")}
                className="block px-4 py-2 w-full text-left hover:bg-gray-600"
              >
                Seguimiento de Pedido
              </button>
              {/* El botón de Cerrar Sesión solo estará en el menú de hamburguesa para usuarios */}
              <button
                onClick={handleLogout}
                className="block px-4 py-2 w-full text-left hover:bg-gray-600"
              >
                Cerrar Sesión
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
};
