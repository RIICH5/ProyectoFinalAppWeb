import React, { useState, useEffect } from "react";
import { db } from "../../services/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";

const MenuView = () => {
  const [menuItems, setMenuItems] = useState([]); // Estado para los productos
  const [selectedCategory, setSelectedCategory] = useState("Todas"); // Filtro de categorías
  const [loading, setLoading] = useState(true); // Indicador de carga
  const [error, setError] = useState(null); // Manejo de errores

  // Cargar productos desde Firestore en tiempo real
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "menu"),
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setMenuItems(items); // Actualiza el estado con los datos en tiempo real
        setLoading(false); // Detiene el indicador de carga
      },
      (err) => {
        console.error("Error al cargar los productos:", err);
        setError("No se pudieron cargar los productos. Intenta nuevamente más tarde.");
        setLoading(false);
      }
    );

    return () => unsubscribe(); // Limpia la suscripción al desmontar el componente
  }, []);

  // Filtrar productos por categoría
  const filteredItems =
    selectedCategory === "Todas"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="menu-view">
      <h1 className="text-2xl font-bold mb-4">Menú</h1>

      {/* Filtro de Categorías */}
      <div className="mb-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border p-2"
        >
          <option value="Todas">Todas</option>
          <option value="Entradas">Entradas</option>
          <option value="Platos Fuertes">Platos Fuertes</option>
          <option value="Postres">Postres</option>
          <option value="Bebidas">Bebidas</option>
        </select>
      </div>

      {/* Indicador de Carga */}
      {loading && <p>Cargando productos...</p>}

      {/* Mensaje de Error */}
      {error && <p className="text-red-600">{error}</p>}

      {/* Listado de Productos */}
      {!loading && !error && (
        <ul>
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <li
                key={item.id}
                className={`border-b p-4 ${item.available ? "" : "opacity-50"}`}
              >
                <h3 className="font-bold">{item.name}</h3>
                <p>Precio: ${item.price.toFixed(2)}</p>
                <p className={item.available ? "text-green-600" : "text-red-600"}>
                  {item.available ? "Disponible" : "Agotado"}
                </p>
                <p>Categoría: {item.category}</p>
              </li>
            ))
          ) : (
            <p>No hay productos en esta categoría.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default MenuView;
