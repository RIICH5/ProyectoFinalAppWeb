import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { OrderContext } from "../../contexts/OrderContext";

const CheckoutPage = () => {
  const { cart, total, clearCart } = useContext(OrderContext); // Datos del carrito
  const navigate = useNavigate();

  // Estados para datos ficticios de pago
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState(null);

  // Simular el pago
  const handlePayment = (isSuccess) => {
    if (!cardName || !cardNumber || !expiryDate || !cvv) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    setError(null);
    if (isSuccess) {
      clearCart(); // Vaciar carrito después del pago exitoso
      navigate("/payment-success");
    } else {
      navigate("/payment-failure");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Pago</h2>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Resumen del Pedido</h3>
        <ul className="divide-y divide-gray-300">
          {cart.map((item) => (
            <li key={item.id} className="py-2 flex justify-between">
              <span>
                {item.name} x{item.quantity}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <p className="text-lg font-bold mt-4">Total: ${total.toFixed(2)}</p>
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Detalles del Pago</h3>
        {error && <p className="text-red-600">{error}</p>}
        <form>
          <input
            type="text"
            placeholder="Nombre en la tarjeta"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="text"
            placeholder="Número de tarjeta"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="MM/AA"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-1/2 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="CVV"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              className="w-1/2 p-2 border rounded"
            />
          </div>
        </form>
      </div>
      <div className="flex gap-4 mt-4">
        <button
          onClick={() => handlePayment(true)} // Simular éxito
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Pagar Ahora
        </button>
        <button
          onClick={() => handlePayment(false)} // Simular falla
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          Simular Error
        </button>
      </div>
    </div>
  );
};

export default CheckoutPage;
