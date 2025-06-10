const Event = require('../models/event.model');

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEventById = async (req,res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createEvent = async (req,res) => {
  try {
    const event = new Event(req.body);
    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
    
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateEvent = async (req,res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
    if (!event) {
      return res.status(404).json({message:'Event not found'});
    }
    res.status(200).json(event);
  } catch (error) {
    res.status(400).json({message:error.message});
  }
};

exports.deleteEvent = async (req,res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({message:'Event not found'});
    }
    res.status(200).json({message:'Event deleted successfully'});
  } catch (error) {
    res.status(500).json({message:error.message});
  }
};