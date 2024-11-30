import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentFailure = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-50">
      <h1 className="text-4xl font-bold text-red-600">¡Pago fallido!</h1>
      <p className="text-lg text-gray-700 mt-4">Lo sentimos, algo salió mal.</p>
      <button
        onClick={() => navigate("/cart")}
        className="mt-6 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
      >
        Volver al Carrito
      </button>
    </div>
  );
};

export default PaymentFailure;
