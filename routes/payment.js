const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.post("/create-payment-intents", async (req, res) => {
    const { amounts } = req.body;

    try {
        const paymentIntents = await Promise.all(
            amounts.map((amount) =>
                stripe.paymentIntents.create({
                    amount,
                    currency: "usd",
                })
            )
        );

        res.json({
            clientSecrets: paymentIntents.map((intent) => intent.client_secret),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;