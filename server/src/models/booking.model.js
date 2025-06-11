const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  itemType: {
    type: String,
    enum: ['event', 'trip', 'hotel', 'flight'],
    required: true
  },
  itemId: {
    type: String, // Changed to String to accommodate flight numbers
    required: true
  },
  paymentIntentId: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'usd' // Changed default to USD for flights
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled', 'failed'],
    default: 'pending'
  },
  // Additional booking details based on item type
  bookingDetails: {
    // For events
    guests: Number,
    // For hotels
    checkIn: Date,
    checkOut: Date,
    roomType: String,
    // For trips
    tripDate: Date,
    numberOfGuests: Number,
    // For flights
    flightClass: String,
    passengers: Number,
    airline: String,
    departure: String,
    arrival: String,
    departureTime: Date,
    arrivalTime: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking; 