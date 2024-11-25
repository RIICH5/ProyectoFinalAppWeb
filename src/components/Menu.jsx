import React, { useState, useEffect } from "react";
import { Item } from "./Item";
import { getMenu } from "../services/menuApi";

export const Menu = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]); // Para almacenar categorías únicas
  const [selectedCategory, setSelectedCategory] = useState(""); // Para almacenar la categoría seleccionada

  useEffect(() => {
    getMenu()
      .then((data) => {
        setItems(data);
        setLoading(false);

        // Extraer categorías únicas
        const uniqueCategories = [...new Set(data.map(item => item.category))];
        setCategories(uniqueCategories);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // Filtrar productos por categoría
  const filteredItems = selectedCategory
    ? items.filter(item => item.category === selectedCategory)
    : items;

  return (
    <>
      <h1 className="text-3xl font-bold">Menu</h1>

      {/* Filtro de Categorías */}
      <div className="my-4">
        <label className="mr-2">Filtrar por categoría:</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border p-2"
        >
          <option value="">Todas</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <h3 className="text-xl">Loading...</h3>
      ) : (
        filteredItems.map((item) => (
          <Item
            key={item.id}
            name={item.name}
            description={item.description}
            price={item.price}
            category={item.category} // Pasar la categoría a Item si la necesitas
          />
        ))
      )}
    </>
  );
};
