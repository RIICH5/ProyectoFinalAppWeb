import React from "react";
import { useNavigate } from "react-router-dom"; // Importa el hook useNavigate
import { logoutUser } from "../services/auth"; // Asumiendo que tienes una función de logout

export const Header = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate(); // Inicializa el hook para navegar

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <a href="/">Restaurant</a>
        </h1>
        <nav>
          <ul className="flex space-x-4">
            {/* Si el usuario está autenticado, muestra el botón de Logout */}
            {isAuthenticated ? (
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
            ) : (
              // Si el usuario no está autenticado, muestra los enlaces para Login y Register
              <>
                <li>
                  <a href="/login" className="text-white px-2 py-1 rounded hover:bg-gray-600">
                    Login
                  </a>
                </li>
                <li>
                  <a href="/register" className="text-white px-2 py-1 rounded hover:bg-gray-600">
                    Register
                  </a>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};
