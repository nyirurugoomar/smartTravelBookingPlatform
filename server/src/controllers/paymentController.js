const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create a payment intent
const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'rwf', metadata } = req.body;

    // Validate required fields
    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    // Check minimum amount for RWF (approximately 1000 RWF = $0.50 USD)
    if (currency.toLowerCase() === 'rwf' && amount < 50) {
      return res.status(400).json({ 
        error: 'Minimum payment amount is 50 RWF (approximately $0.10 USD)',
        minAmount: 1000
      });
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: currency.toLowerCase() === 'rwf' ? Math.round(amount) : Math.round(amount * 100), // Only convert to cents for non-RWF currencies
      currency: currency.toLowerCase(),
      metadata,
      // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error('Error creating payment intent:', err);
    res.status(500).json({ error: err.message });
  }
};

// Retrieve a payment intent
const getPaymentIntent = async (req, res) => {
  try {
    const { paymentIntentId } = req.params;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    res.json(paymentIntent);
  } catch (err) {
    console.error('Error retrieving payment intent:', err);
    res.status(500).json({ error: err.message });
  }
};

// Handle webhook events
const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        // Handle successful payment
        // Update your database, send confirmation email, etc.
        console.log('Payment succeeded:', paymentIntent.id);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        // Handle failed payment
        console.log('Payment failed:', failedPayment.id);
        break;

      // Add more event types as needed
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};

// Get publishable key
const getPublishableKey = async (req, res) => {
  try {
    res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
  } catch (error) {
    console.error('Error getting publishable key:', error);
    res.status(500).json({ 
      error: 'Error getting publishable key',
      message: error.message 
    });
  }
};

module.exports = {
  createPaymentIntent,
  getPaymentIntent,
  handleWebhook,
  getPublishableKey
}; 