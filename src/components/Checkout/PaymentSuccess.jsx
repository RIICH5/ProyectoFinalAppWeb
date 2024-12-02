import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-50">
      <h1 className="text-4xl font-bold text-green-600">¡Pago exitoso!</h1>
      <p className="text-lg text-gray-700 mt-4">Gracias por tu compra.</p>
      <button
        onClick={() => navigate("/")}
        className="mt-6 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
      >
        Volver al Menú
      </button>
    </div>
  );
};

export default PaymentSuccess;
