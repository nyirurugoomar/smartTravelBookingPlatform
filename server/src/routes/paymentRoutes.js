const express = require('express');
const router = express.Router();
const { 
  createPaymentIntent, 
  getPaymentIntent, 
  handleWebhook,
  getPublishableKey 
} = require('../controllers/paymentController');
const { authenticateToken } = require('../middleware/auth');

// Get publishable key - This should be public (no auth required)
router.get('/publishable-key', getPublishableKey);

// Create a payment intent
router.post('/create-payment-intent', authenticateToken, createPaymentIntent);

// Get payment intent status
router.get('/payment-intent/:paymentIntentId', authenticateToken, getPaymentIntent);

// Webhook endpoint - Note: This should not use the auth middleware
router.post('/webhook', express.raw({type: 'application/json'}), handleWebhook);

module.exports = router; 