const express = require('express');
const router = express.Router();
const eventController = require('../controllers/event.controller');
const {body} = require('express-validator');

const validateEvent = [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('images').isArray().withMessage('Images must be an array'),
  body('date').isDate().withMessage('Date must be a valid date'),
  body('time').notEmpty().withMessage('Time is required'),
  body('location').notEmpty().withMessage('Location is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('capacity').isInt().withMessage('Capacity must be an integer')
];

router.get('/',eventController.getAllEvents);
router.get('/:id',eventController.getEventById);
router.post('/',validateEvent,eventController.createEvent);
router.put('/:id',validateEvent,eventController.updateEvent);
router.delete('/:id',validateEvent,eventController.deleteEvent);

module.exports = router;