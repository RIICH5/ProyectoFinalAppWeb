import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("tu_clave_publica");

const CheckoutForm = ({ clientSecret }) => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
            },
        });

        if (error) {
            console.error("Error en el pago:", error);
        } else {
            console.log("Pago exitoso:", paymentIntent);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <button type="submit" disabled={!stripe}>Pagar</button>
        </form>
    );
};

const PaymentPage = ({ amount }) => {
    const [clientSecret, setClientSecret] = React.useState("");

    React.useEffect(() => {
        fetch("/api/payment/create-payment-intents", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amounts: [amount] }),
        })
            .then((res) => res.json())
            .then((data) => setClientSecret(data.clientSecrets[0]));
    }, [amount]);

    return (
        <Elements stripe={stripePromise}>
            {clientSecret ? <CheckoutForm clientSecret={clientSecret} /> : <p>Cargando...</p>}
        </Elements>
    );
};

export default PaymentPage;
