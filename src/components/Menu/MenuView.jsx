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
        setMenuItems(items);
        setLoading(false);
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

  // Verificar si un producto está en el carrito
  const isInCart = (productId) => cart.some((item) => item.id === productId);

  // Obtener la cantidad de un producto en el carrito
  const getItemQuantity = (productId) => {
    const item = cart.find((item) => item.id === productId);
    return item ? item.quantity : 0;
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
          {filteredItems.map((item) => (
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

              {/* Botones para agregar o quitar */}
              {item.available && (
                <div className="flex items-center gap-2 mt-2">
                  {!isInCart(item.id) ? (
                    <button
                      onClick={() => addToCart({ ...item, quantity: 1 })}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                    >
                      Agregar al Carrito
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => addToCart({ ...item, quantity: 1 })}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                      >
                        +
                      </button>
                      <span>{getItemQuantity(item.id)}</span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                      >
                        -
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
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
