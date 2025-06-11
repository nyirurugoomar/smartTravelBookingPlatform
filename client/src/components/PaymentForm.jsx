import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import api from '../api/axios';

// Debug logging for Stripe key
console.log('Stripe Key:', import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Load Stripe outside of component to avoid recreating on each render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Payment Form Component
const CheckoutForm = ({ amount, usdAmount, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
      });

      if (submitError) {
        setError(submitError.message);
      } else {
        onSuccess();
      }
    } catch (err) {
      setError('An unexpected error occurred.');
      console.error('Payment error:', err);
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Payment Details</h2>
        <div className="text-gray-600">
          <p>Amount to pay: RWF {amount.toLocaleString()}</p>
          {usdAmount && (
            <p className="text-sm text-gray-500">(Approximately ${usdAmount.toFixed(2)} USD)</p>
          )}
        </div>
      </div>

      <PaymentElement className="mb-6" />

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          disabled={processing}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {processing ? 'Processing...' : 'Pay Now'}
        </button>
      </div>
    </form>
  );
};

// Main Payment Component
const PaymentForm = ({ amount, itemType, itemId, onSuccess, onCancel }) => {
  const [clientSecret, setClientSecret] = useState(null);
  const [error, setError] = useState(null);
  const [usdAmount, setUsdAmount] = useState(null);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        // Get user from localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
          setError('Please log in to make a payment');
          return;
        }

        console.log('Creating payment intent with:', {
          amount,
          currency: 'rwf',
          itemType,
          itemId,
          userId: user.id
        });

        const response = await api.post('/payments/create-payment-intent', {
          amount,
          currency: 'rwf',
          metadata: {
            itemType,
            itemId,
            userId: user.id
          },
        });

        console.log('Payment intent response:', response.data);

        if (response.data.error) {
          if (response.data.minAmount) {
            setError(`Minimum payment amount is ${response.data.minAmount.toLocaleString()} RWF. Please increase the number of nights or select a different room.`);
          } else {
            setError(response.data.error);
          }
          return;
        }

        const { clientSecret, usdAmount } = response.data;
        setClientSecret(clientSecret);
        if (usdAmount) {
          setUsdAmount(usdAmount);
        }
      } catch (err) {
        console.error('Payment intent creation failed:', {
          error: err,
          response: err.response?.data,
          status: err.response?.status,
          message: err.message,
        });
        setError(err.response?.data?.error || 'Failed to initialize payment');
      }
    };

    createPaymentIntent();
  }, [amount, itemType, itemId]);

  if (error) {
    return (
      <div className="w-full max-w-md mx-auto p-6">
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
        <button
          onClick={onCancel}
          className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="w-full max-w-md mx-auto p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading payment form...</p>
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#3B82F6',
          },
        },
      }}
    >
      <CheckoutForm
        amount={amount}
        usdAmount={usdAmount}
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
    </Elements>
  );
};

export default PaymentForm; 