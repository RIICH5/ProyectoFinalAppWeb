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
<<<<<<< HEAD
};
=======
};
>>>>>>> ff61ab0ae3cb57b8e1b3a5831a57e48cb3e2348a
