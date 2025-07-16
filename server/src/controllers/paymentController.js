const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/booking.model');

// Create a payment intent
const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'rwf', metadata } = req.body;
    console.log('Creating payment intent with:', {
      amount,
      currency,
      metadata,
      userId: req.user.userId
    });

    // Validate required fields
    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    // Validate metadata
    if (!metadata.itemType || !metadata.itemId) {
      console.error('Missing required metadata:', metadata);
      return res.status(400).json({ error: 'Item type and ID are required' });
    }

    // For RWF, we need to convert to USD 
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
      const paymentIntentData = {
        amount: Math.round(usdAmount), // Amount in cents for USD
        currency: 'usd',
        metadata: {
          ...metadata,
          userId: req.user.userId, // Add user ID to metadata
          originalAmount: amount,
          originalCurrency: 'rwf',
          rwfToUsdRate: RWF_TO_USD_RATE
        },
        automatic_payment_methods: {
          enabled: true,
        },
      };

      console.log('Creating USD payment intent with data:', paymentIntentData);

      const paymentIntent = await stripe.paymentIntents.create(paymentIntentData);
      console.log('Payment intent created:', {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        metadata: paymentIntent.metadata
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
        originalAmount: amount,
        usdAmount: usdAmount / 100 // Convert back to dollars for display
      });
    } else {
      // Handle other currencies (converting to cents)
      const paymentIntentData = {
        amount: Math.round(amount * 100),
        currency: currency.toLowerCase(),
        metadata: {
          ...metadata,
          userId: req.user.userId // Add user ID to metadata
        },
        automatic_payment_methods: {
          enabled: true,
        },
      };

      console.log('Creating payment intent with data:', paymentIntentData);

      const paymentIntent = await stripe.paymentIntents.create(paymentIntentData);
      console.log('Payment intent created:', {
        id: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        metadata: paymentIntent.metadata
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
      });
    }
  } catch (err) {
    console.error('Error creating payment intent:', {
      error: err.message,
      stack: err.stack,
      code: err.code
    });
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
  console.log('=== WEBHOOK RECEIVED ===');
  console.log('Signature:', sig);
  console.log('Webhook secret:', process.env.STRIPE_WEBHOOK_SECRET);
  console.log('Request body:', JSON.stringify(req.body, null, 2));

  try {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      console.error('STRIPE_WEBHOOK_SECRET is not set in environment variables');
      return res.status(500).json({ error: 'Webhook secret not configured' });
    }

    // for here im tryin to verifi webhook is reealu from stripe
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log('=== WEBHOOK EVENT DETAILS ===');
    console.log('Event type:', event.type);
    console.log('Event ID:', event.id);
    console.log('Event data:', JSON.stringify(event.data.object, null, 2));

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('=== PAYMENT SUCCEEDED ===');
        console.log('Payment Intent ID:', paymentIntent.id);
        console.log('Amount:', paymentIntent.amount);
        console.log('Currency:', paymentIntent.currency);
        console.log('Metadata:', JSON.stringify(paymentIntent.metadata, null, 2));
        
        // Validate required metadata
        if (!paymentIntent.metadata.userId || !paymentIntent.metadata.itemType || !paymentIntent.metadata.itemId) {
          console.error('Missing required metadata:', {
            userId: paymentIntent.metadata.userId,
            itemType: paymentIntent.metadata.itemType,
            itemId: paymentIntent.metadata.itemId
          });
          return res.status(400).json({ error: 'Missing required metadata' });
        }

        // Create a booking for successful payments
        try {
          console.log('=== CREATING BOOKING ===');
          
          const bookingData = {
            userId: paymentIntent.metadata.userId,
            itemType: paymentIntent.metadata.itemType,
            itemId: paymentIntent.metadata.itemId,
            paymentIntentId: paymentIntent.id,
            amount: paymentIntent.amount / (paymentIntent.currency === 'rwf' ? 1 : 100),
            currency: paymentIntent.currency,
            status: 'completed',
            bookingDetails: {
              ...paymentIntent.metadata,
              checkIn: paymentIntent.metadata.checkIn ? new Date(paymentIntent.metadata.checkIn) : undefined,
              checkOut: paymentIntent.metadata.checkOut ? new Date(paymentIntent.metadata.checkOut) : undefined,
              tripDate: paymentIntent.metadata.tripDate ? new Date(paymentIntent.metadata.tripDate) : undefined,
              guests: paymentIntent.metadata.guests ? parseInt(paymentIntent.metadata.guests) : undefined,
              numberOfGuests: paymentIntent.metadata.numberOfGuests ? parseInt(paymentIntent.metadata.numberOfGuests) : undefined
            }
          };

          console.log('Booking data:', JSON.stringify(bookingData, null, 2));

          const booking = new Booking(bookingData);
          const savedBooking = await booking.save();
          
          console.log('=== BOOKING SAVED ===');
          console.log('Booking ID:', savedBooking._id);
          console.log('User ID:', savedBooking.userId);
          console.log('Item Type:', savedBooking.itemType);
          console.log('Status:', savedBooking.status);

          // Verify the booking was saved
          const verifiedBooking = await Booking.findById(savedBooking._id);
          console.log('=== BOOKING VERIFICATION ===');
          console.log('Booking found in database:', verifiedBooking ? 'Yes' : 'No');
          if (verifiedBooking) {
            console.log('Verified booking details:', JSON.stringify(verifiedBooking, null, 2));
          }

        } catch (bookingError) {
          console.error('=== BOOKING CREATION ERROR ===');
          console.error('Error message:', bookingError.message);
          console.error('Error stack:', bookingError.stack);
          console.error('Payment intent metadata:', JSON.stringify(paymentIntent.metadata, null, 2));
        }
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('Payment failed - Full payment intent:', JSON.stringify(failedPayment, null, 2));
        
        // Create a failed booking record
        try {
          const bookingData = {
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
          };

          console.log('Attempting to create failed booking with data:', JSON.stringify(bookingData, null, 2));

          const booking = new Booking(bookingData);
          const savedBooking = await booking.save();
          
          console.log('Failed booking recorded:', {
            id: savedBooking._id,
            userId: savedBooking.userId,
            itemType: savedBooking.itemType,
            status: savedBooking.status
          });

        } catch (bookingError) {
          console.error('Error recording failed booking:', {
            error: bookingError.message,
            stack: bookingError.stack,
            metadata: failedPayment.metadata
          });
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('=== WEBHOOK ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Signature:', sig);
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