import React, { useState, useEffect, useContext } from "react";
import { db } from "../../services/firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import { OrderContext } from "../../contexts/OrderContext"; // Usamos el contexto del carrito
import { useNavigate } from "react-router-dom"; // Para navegar a la página del carrito

const MenuView = () => {
  const [menuItems, setMenuItems] = useState([]); // Estado para los productos
  const [selectedCategory, setSelectedCategory] = useState("Todas"); // Filtro de categorías
  const [loading, setLoading] = useState(true); // Indicador de carga
  const [error, setError] = useState(null); // Manejo de errores
  const { cart, total, addToCart, removeFromCart } = useContext(OrderContext); // Accedemos al carrito y al total
  const [itemFeedback, setItemFeedback] = useState({}); // Un objeto para manejar el feedback por cada producto
  
  // Navegación al carrito
  const navigate = useNavigate();

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

  // Función para verificar si el producto ya está en el carrito
  const isInCart = (productId) => {
    return cart.some(item => item.id === productId);
  };

  // Función para manejar el feedback de agregar o quitar del carrito
  const handleAddToCart = (item) => {
    setItemFeedback((prev) => ({ ...prev, [item.id]: "adding" })); // Activar feedback de agregar
    addToCart(item);
    setTimeout(() => {
      setItemFeedback((prev) => ({ ...prev, [item.id]: null })); // Restablecer feedback después de 1 segundo
    }, 1000);
  };

  const handleRemoveFromCart = (item) => {
    setItemFeedback((prev) => ({ ...prev, [item.id]: "removing" })); // Activar feedback de quitar
    removeFromCart(item.id);
    setTimeout(() => {
      setItemFeedback((prev) => ({ ...prev, [item.id]: null })); // Restablecer feedback después de 1 segundo
    }, 1000);
  };

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className={`border p-4 ${item.available ? "" : "opacity-50"}`}
              >
                <h3 className="font-bold">{item.name}</h3>
                <p>{item.description}</p>
                <p>Precio: ${item.price.toFixed(2)}</p>
                <p className={item.available ? "text-green-600" : "text-red-600"}>
                  {item.available ? "Disponible" : "Agotado"}
                </p>
                <p>Categoría: {item.category}</p>

                {/* Botón de agregar o quitar del carrito */}
                {item.available ? (
                  <button
                    onClick={() => {
                      if (isInCart(item.id)) {
                        handleRemoveFromCart(item);
                      } else {
                        handleAddToCart(item);
                      }
                    }}
                    className={`bg-blue-500 text-white px-4 py-2 mt-2 rounded 
                      ${isInCart(item.id) ? "bg-green-500" : "bg-blue-500"} 
                      ${itemFeedback[item.id] === "adding" ? "animate-pulse bg-green-400" : ""} 
                      ${itemFeedback[item.id] === "removing" ? "animate-pulse bg-red-400" : ""}`}
                  >
                    {isInCart(item.id) ? "Quitar del Carrito" : "Agregar al Carrito"}
                  </button>
                ) : (
                  <button
                    disabled
                    className="bg-gray-500 text-white px-4 py-2 mt-2 rounded opacity-50 cursor-not-allowed"
                  >
                    No Disponible
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>No hay productos en esta categoría.</p>
          )}
        </div>
      )}

      {/* Resumen del carrito visible en el menú */}
      <div className="cart-summary mt-8 p-4 bg-gray-100 rounded">
        <h3 className="text-xl font-bold mb-2">Resumen del Carrito</h3>
        {cart.length === 0 ? (
          <p className="text-center text-gray-500">Tu carrito está vacío.</p>
        ) : (
          <>
            <ul className="mb-4">
              {cart.map((item) => (
                <li key={item.id} className="flex justify-between mb-2">
                  <span>{item.name} x{item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between mb-4 font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button
              onClick={() => navigate("/cart")}
              className="w-full bg-blue-500 text-white py-2 rounded"
            >
              Ir al Carrito
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MenuView;
