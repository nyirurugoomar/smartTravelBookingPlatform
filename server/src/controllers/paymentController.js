const stripe = require('../config/stripe');

// Create a payment intent
const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'rwf', paymentMethodTypes = ['card'] } = req.body;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents/smallest currency unit
      currency: currency.toLowerCase(),
      payment_method_types: paymentMethodTypes,
      // Add metadata if needed
      metadata: {
        // Add any relevant metadata here
        // For example: orderId, userId, etc.
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ 
      error: 'Error creating payment intent',
      message: error.message 
    });
  }
};

// Retrieve a payment intent
const getPaymentIntent = async (req, res) => {
  try {
    const { paymentIntentId } = req.params;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    res.json(paymentIntent);
  } catch (error) {
    console.error('Error retrieving payment intent:', error);
    res.status(500).json({ 
      error: 'Error retrieving payment intent',
      message: error.message 
    });
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