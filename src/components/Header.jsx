import React from "react";
import { useNavigate, Link } from "react-router-dom"; // Importa Link para navegación interna
import { logoutUser } from "../services/auth";

export const Header = ({
  isAdmin,
  setIsAdmin,
  isAuthenticated,
  setIsAuthenticated,
}) => {
  const navigate = useNavigate(); // Inicializa el hook para navegar

  const handleUser = () => {
    setIsAdmin(!isAdmin);
    navigate(isAdmin ? "/" : "/admin"); // Redirige según el estado
  };

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Título del restaurante */}
        <h1 className="text-2xl font-bold">
          <Link to="/">Restaurant</Link>
        </h1>

        {/* Navegación */}
        <nav>
          <ul className="flex space-x-4">
            {/* Botón de Admin o Usuario */}
            <li>
              <button
                onClick={handleUser}
                className="bg-white text-gray-800 px-2 py-1 rounded"
              >
                {isAdmin ? "Admin" : "User"}
              </button>
            </li>

            {/* Opciones para Usuarios Autenticados */}
            {isAuthenticated && !isAdmin && (
              <>
                <li>
                  <Link
                    to="/cart"
                    className="bg-white text-gray-800 px-2 py-1 rounded"
                  >
                    Carrito
                  </Link>
                </li>
                <li>
                  <Link
                    to="/history"
                    className="bg-white text-gray-800 px-2 py-1 rounded"
                  >
                    Historial
                  </Link>
                </li>
              </>
            )}

            {/* Botón de Logout */}
            {isAuthenticated && (
              <li>
                <button
                  onClick={async () => {
                    await logoutUser();
                    setIsAuthenticated(false);
                    navigate("/"); // Redirige al inicio al cerrar sesión
                  }}
                  className="bg-white text-gray-800 px-2 py-1 rounded"
                >
                  Logout
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};