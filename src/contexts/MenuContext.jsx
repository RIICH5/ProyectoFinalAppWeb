import React, { createContext, useState, useContext, useMemo } from "react";

/**
 * Crea el contexto para el menú.
 */
export const MenuContext = createContext();

/**
 * Proveedor del contexto del menú.
 * Este componente envuelve a los componentes hijos que necesitan acceder al estado del menú.
 *
 * @param {React.ReactNode} children - Componentes hijos que consumirán el contexto.
 */
export const MenuProvider = ({ children }) => {
  const [items, setItems] = useState([]); // Estado para los items del menú
  const [categories, setCategories] = useState([]); // Estado para las categorías del menú

  // Memoriza los valores para evitar renderizaciones innecesarias
  const contextValue = useMemo(
    () => ({ items, setItems, categories, setCategories }),
    [items, categories]
  );

  return (
    <MenuContext.Provider value={contextValue}>
      {children}
    </MenuContext.Provider>
  );
};

/**
 * Hook personalizado para consumir el contexto del menú.
 * Proporciona acceso al estado del menú y sus funciones de actualización.
 *
 * @returns {Object} Valores del contexto del menú.
 * @throws {Error} Si se intenta usar fuera de un MenuProvider.
 */
export const useMenu = () => {
  const context = useContext(MenuContext);

  // Verifica que el contexto esté disponible
  if (!context) {
    throw new Error(
      "El hook useMenu debe ser utilizado dentro de un componente envuelto por MenuProvider"
    );
  }

  return context;
};
