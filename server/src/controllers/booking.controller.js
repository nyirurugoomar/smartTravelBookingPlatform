const Booking = require('../models/booking.model');
const Event = require('../models/event.model');
const Trip = require('../models/trip.model');
const Hotel = require('../models/hotel.model');

// Get all bookings for a user
const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.userId;
    const bookings = await Booking.find({ userId })
      .sort({ createdAt: -1 }); // Most recent first

    // Populate item details based on itemType
    const populatedBookings = await Promise.all(bookings.map(async (booking) => {
      let itemDetails = null;
      switch (booking.itemType) {
        case 'event':
          itemDetails = await Event.findById(booking.itemId);
          break;
        case 'trip':
          itemDetails = await Trip.findById(booking.itemId);
          break;
        case 'hotel':
          itemDetails = await Hotel.findById(booking.itemId);
          break;
      }

      return {
        ...booking.toObject(),
        itemDetails
      };
    }));

    res.json(populatedBookings);
  } catch (err) {
    console.error('Error fetching user bookings:', err);
    res.status(500).json({ error: 'Error fetching bookings' });
  }
};

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const {
      itemType,
      itemId,
      paymentIntentId,
      amount,
      currency,
      bookingDetails
    } = req.body;

    const userId = req.user.userId;

    // Validate item exists
    let itemExists = false;
    switch (itemType) {
      case 'event':
        itemExists = await Event.exists({ _id: itemId });
        break;
      case 'trip':
        itemExists = await Trip.exists({ _id: itemId });
        break;
      case 'hotel':
        itemExists = await Hotel.exists({ _id: itemId });
        break;
    }

    if (!itemExists) {
      return res.status(404).json({ error: `${itemType} not found` });
    }

    const booking = new Booking({
      userId,
      itemType,
      itemId,
      paymentIntentId,
      amount,
      currency,
      bookingDetails,
      status: 'pending'
    });

    await booking.save();

    res.status(201).json(booking);
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(500).json({ error: 'Error creating booking' });
  }
};

// Update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Verify user owns the booking
    if (booking.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    booking.status = status;
    await booking.save();

    res.json(booking);
  } catch (err) {
    console.error('Error updating booking status:', err);
    res.status(500).json({ error: 'Error updating booking' });
  }
};

// Get booking details
const getBookingDetails = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Verify user owns the booking
    if (booking.userId.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    // Populate item details
    let itemDetails = null;
    switch (booking.itemType) {
      case 'event':
        itemDetails = await Event.findById(booking.itemId);
        break;
      case 'trip':
        itemDetails = await Trip.findById(booking.itemId);
        break;
      case 'hotel':
        itemDetails = await Hotel.findById(booking.itemId);
        break;
    }

    res.json({
      ...booking.toObject(),
      itemDetails
    });
  } catch (err) {
    console.error('Error fetching booking details:', err);
    res.status(500).json({ error: 'Error fetching booking details' });
  }
};

module.exports = {
  getUserBookings,
  createBooking,
  updateBookingStatus,
  getBookingDetails
}; 