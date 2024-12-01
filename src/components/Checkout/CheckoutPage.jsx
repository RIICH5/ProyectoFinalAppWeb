import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { OrderContext } from "../../contexts/OrderContext";
import { db } from "../../services/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const CheckoutPage = () => {
  const { cart, total, clearCart } = useContext(OrderContext);
  const navigate = useNavigate();
  const auth = getAuth();
  const userId = auth.currentUser?.uid;

  const [numClients, setNumClients] = useState(1);
  const [splitAmounts, setSplitAmounts] = useState([total]);
  const [paymentMethods, setPaymentMethods] = useState(["card"]);
  const [cardDetails, setCardDetails] = useState([{ name: "", number: "", expiry: "", cvv: "" }]);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const formatCardNumber = (value) => {
    return value
      .replace(/\D/g, "")
      .replace(/(.{4})/g, "$1 ")
      .trim();
  };

  const formatExpiryDate = (value) => {
    const cleanValue = value.replace(/\D/g, "");
    if (cleanValue.length > 2) {
      return `${cleanValue.slice(0, 2)}/${cleanValue.slice(2, 4)}`;
    }
    return cleanValue;
  };

  const handleCardDetailsChange = (index, field, value) => {
    setCardDetails((prev) => {
      const updatedDetails = [...prev];
      updatedDetails[index] = {
        ...updatedDetails[index],
        [field]:
          field === "number"
            ? formatCardNumber(value)
            : field === "expiry"
            ? formatExpiryDate(value)
            : value,
      };
      return updatedDetails;
    });
  };

  const handleNumClientsChange = (e) => {
    const num = Math.max(1, parseInt(e.target.value, 10) || 1);
    setNumClients(num);

    const split = Array(num).fill((total / num).toFixed(2));
    setSplitAmounts(split);
    setPaymentMethods(Array(num).fill("card"));
    setCardDetails(Array(num).fill({ name: "", number: "", expiry: "", cvv: "" }));
  };

  const handleSplitChange = (index, value) => {
    const updatedSplit = [...splitAmounts];
    updatedSplit[index] = value;
    setSplitAmounts(updatedSplit);
  };

  const handlePaymentMethodChange = (index, method) => {
    const updatedMethods = [...paymentMethods];
    updatedMethods[index] = method;
    setPaymentMethods(updatedMethods);
  };

  const handlePayment = async () => {
    const totalSplit = splitAmounts.reduce((sum, amt) => parseFloat(sum) + parseFloat(amt), 0);

    if (totalSplit !== total) {
      setError("El total dividido no coincide con el total de la cuenta.");
      return;
    }

    setError(null);
    setProcessing(true);

    try {
      const transactionId = `trans_${Date.now()}`; // Generar un ID único de transacción

      for (let i = 0; i < numClients; i++) {
        if (paymentMethods[i] === "card") {
          const { name, number, expiry, cvv } = cardDetails[i];
          if (!name || !number || !expiry || !cvv) {
            setError(`Por favor, completa los datos de tarjeta para el cliente ${i + 1}.`);
            setProcessing(false);
            return;
          }
        }

        const paymentData = {
          userId,
          amount: parseFloat(splitAmounts[i]),
          method: paymentMethods[i],
          cardDetails: paymentMethods[i] === "card" ? cardDetails[i] : null,
          transactionId, // Agregar el ID de la transacción
          createdAt: serverTimestamp(),
        };

        await addDoc(collection(db, "payments"), paymentData);
      }

      const orderData = {
        userId,
        items: cart,
        total,
        transactionId, // Agregar el ID de la transacción
        status: "completed",
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "orders"), orderData);

      clearCart();
      navigate("/payment-success");
    } catch (error) {
      console.error("Error al procesar el pago:", error);
      setError("Hubo un problema al procesar los pagos.");
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Dividir y Pagar</h2>
      <div className="mb-4">
        <label className="block text-lg font-semibold mb-2">Número de Clientes:</label>
        <input
          type="number"
          value={numClients}
          min={1}
          onChange={handleNumClientsChange}
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-semibold">Montos Divididos</h3>
        {Array.from({ length: numClients }).map((_, i) => (
          <div key={i} className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <input
                type="number"
                value={splitAmounts[i] || ""}
                onChange={(e) => handleSplitChange(i, e.target.value)}
                className="w-1/2 p-2 border rounded"
              />
              <select
                value={paymentMethods[i] || "card"}
                onChange={(e) => handlePaymentMethodChange(i, e.target.value)}
                className="w-1/3 p-2 border rounded"
              >
                <option value="card">Tarjeta</option>
                <option value="cash">Efectivo</option>
              </select>
            </div>
            {paymentMethods[i] === "card" && (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Nombre en la tarjeta"
                  value={cardDetails[i]?.name || ""}
                  onChange={(e) => handleCardDetailsChange(i, "name", e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Número de tarjeta"
                  value={cardDetails[i]?.number || ""}
                  onChange={(e) => handleCardDetailsChange(i, "number", e.target.value)}
                  maxLength={19}
                  className="w-full p-2 border rounded"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="MM/AA"
                    value={cardDetails[i]?.expiry || ""}
                    onChange={(e) => handleCardDetailsChange(i, "expiry", e.target.value)}
                    maxLength={5}
                    className="w-1/2 p-2 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    value={cardDetails[i]?.cvv || ""}
                    onChange={(e) => handleCardDetailsChange(i, "cvv", e.target.value)}
                    maxLength={3}
                    className="w-1/2 p-2 border rounded"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {error && <p className="text-red-600">{error}</p>}

      <button
        onClick={handlePayment}
        disabled={processing}
        className={`w-full py-2 rounded transition ${
          processing ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 text-white"
        }`}
      >
        {processing ? "Procesando..." : "Confirmar y Pagar"}
      </button>
    </div>
  );
};

export default CheckoutPage;
