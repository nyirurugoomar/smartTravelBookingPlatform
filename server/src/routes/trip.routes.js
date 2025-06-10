const express = require('express');
const router = express.Router();
const tripController = require('../controllers/trip.controller');
const { body } = require('express-validator');

const validateTrip = [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('images').notEmpty().withMessage('Images are required'),
  body('date').isDate().withMessage('Date must be a valid date'),
];

router.get('/',tripController.getAllTrips);
router.get('/:id',tripController.getTripById);
router.post('/',validateTrip,tripController.createTrip);
router.put('/:id',validateTrip,tripController.updateTrip);
router.delete('/:id',tripController.deleteTrip);

module.exports = router;