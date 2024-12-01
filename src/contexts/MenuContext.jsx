import React, { createContext, useState } from "react";

export const MenuContext = createContext();

export const MenuProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);

  return (
    <MenuContext.Provider value={{items, setItems, categories, setCategories }}>
      {children}
    </MenuContext.Provider>
  );
};
