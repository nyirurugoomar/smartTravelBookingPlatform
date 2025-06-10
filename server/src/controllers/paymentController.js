const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/booking.model');

// Create a payment intent
const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'rwf', metadata } = req.body;

    // Validate required fields
    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    // For RWF, we need to convert to USD to meet Stripe's minimum amount requirement
    // Current approximate rate: 1 USD ≈ 1300 RWF
    const RWF_TO_USD_RATE = 1300;
    const MIN_USD_AMOUNT = 0.50; // Stripe's minimum amount in USD
    const MIN_RWF_AMOUNT = 200; // Our minimum amount in RWF

    if (currency.toLowerCase() === 'rwf') {
      if (amount < MIN_RWF_AMOUNT) {
        return res.status(400).json({ 
          error: `Minimum payment amount is ${MIN_RWF_AMOUNT.toLocaleString()} RWF`,
          minAmount: MIN_RWF_AMOUNT
        });
      }

      // Convert RWF to USD for Stripe
      const usdAmount = (amount / RWF_TO_USD_RATE) * 100; // Convert to cents for USD
      
      // Create a PaymentIntent with USD
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(usdAmount), // Amount in cents for USD
        currency: 'usd',
        metadata: {
          ...metadata,
          originalAmount: amount,
          originalCurrency: 'rwf',
          rwfToUsdRate: RWF_TO_USD_RATE
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
        originalAmount: amount,
        usdAmount: usdAmount / 100 // Convert back to dollars for display
      });
    } else {
      // Handle other currencies (converting to cents)
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: currency.toLowerCase(),
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
      });
    }
  } catch (err) {
    console.error('Error creating payment intent:', err);
    if (err.code === 'parameter_invalid_integer') {
      res.status(400).json({ 
        error: 'Amount is too small. Minimum payment amount is 200 RWF',
        minAmount: 200
      });
    } else {
      res.status(500).json({ error: err.message });
    }
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
        
        // Create a booking for successful payments
        try {
          const booking = new Booking({
            userId: paymentIntent.metadata.userId,
            itemType: paymentIntent.metadata.itemType,
            itemId: paymentIntent.metadata.itemId,
            paymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount / (paymentIntent.currency === 'rwf' ? 1 : 100), // Convert back from cents if needed
            currency: paymentIntent.currency,
            status: 'completed',
            bookingDetails: {
              ...paymentIntent.metadata,
              // Convert string dates back to Date objects if they exist
              checkIn: paymentIntent.metadata.checkIn ? new Date(paymentIntent.metadata.checkIn) : undefined,
              checkOut: paymentIntent.metadata.checkOut ? new Date(paymentIntent.metadata.checkOut) : undefined,
              tripDate: paymentIntent.metadata.tripDate ? new Date(paymentIntent.metadata.tripDate) : undefined,
              // Convert numeric strings back to numbers
              guests: paymentIntent.metadata.guests ? parseInt(paymentIntent.metadata.guests) : undefined,
              numberOfGuests: paymentIntent.metadata.numberOfGuests ? parseInt(paymentIntent.metadata.numberOfGuests) : undefined
            }
          });

          await booking.save();
          console.log('Booking created:', booking._id);
        } catch (bookingError) {
          console.error('Error creating booking:', bookingError);
          // Don't throw the error, as the payment was successful
          // We can handle failed booking creation separately
        }
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        // Create a failed booking record
        try {
          const booking = new Booking({
            userId: failedPayment.metadata.userId,
            itemType: failedPayment.metadata.itemType,
            itemId: failedPayment.metadata.itemId,
            paymentIntentId: failedPayment.id,
            amount: failedPayment.amount / (failedPayment.currency === 'rwf' ? 1 : 100),
            currency: failedPayment.currency,
            status: 'failed',
            bookingDetails: {
              ...failedPayment.metadata,
              checkIn: failedPayment.metadata.checkIn ? new Date(failedPayment.metadata.checkIn) : undefined,
              checkOut: failedPayment.metadata.checkOut ? new Date(failedPayment.metadata.checkOut) : undefined,
              tripDate: failedPayment.metadata.tripDate ? new Date(failedPayment.metadata.tripDate) : undefined,
              guests: failedPayment.metadata.guests ? parseInt(failedPayment.metadata.guests) : undefined,
              numberOfGuests: failedPayment.metadata.numberOfGuests ? parseInt(failedPayment.metadata.numberOfGuests) : undefined
            }
          });

          await booking.save();
          console.log('Failed booking recorded:', booking._id);
        } catch (bookingError) {
          console.error('Error recording failed booking:', bookingError);
        }
        break;

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