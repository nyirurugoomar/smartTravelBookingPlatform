const Trip = require('../models/trip.model');

// Get all trips
exports.getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.find();
    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.status(200).json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createTrip = async (req, res) => {
  const { name, description, images, date, price, capacity, location, activities, itinerary } = req.body;
  const trip = new Trip({ name, description, images, date, price, capacity, location, activities, itinerary });
  try {
    const newTrip = await trip.save();
    res.status(201).json(newTrip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTrip = async (req, res) => {
  const { name, description, images, date, price, capacity, location, activities, itinerary } = req.body;
  const trip = await Trip.findByIdAndUpdate(req.params.id, { name, description, images, date, price, capacity, location, activities, itinerary }, { new: true });
  if (!trip) {
    return res.status(404).json({ message: 'Trip not found' });
  }
  res.status(200).json(trip);
};

exports.deleteTrip = async (req, res) => {
  const trip = await Trip.findByIdAndDelete(req.params.id);
  if (!trip) {
    return res.status(404).json({ message: 'Trip not found' });
  }
  res.status(200).json({ message: 'Trip deleted successfully' });
};