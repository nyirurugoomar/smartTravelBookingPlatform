const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotel.controller');
const { body } = require('express-validator');

// Validation middleware
const validateHotel = [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('address.street').notEmpty().withMessage('Street is required'),
  body('address.city').notEmpty().withMessage('City is required'),
  body('address.state').notEmpty().withMessage('State is required'),
  body('address.country').notEmpty().withMessage('Country is required'),
  body('address.zipCode').notEmpty().withMessage('Zip code is required'),
  body('pricePerNight').isNumeric().withMessage('Price must be a number'),
  body('rooms').isArray().withMessage('Rooms must be an array')
];

// Routes
router.get('/', hotelController.getAllHotels);
router.get('/:id', hotelController.getHotelById);
router.post('/', validateHotel, hotelController.createHotel);
router.put('/:id', validateHotel, hotelController.updateHotel);
router.delete('/:id', hotelController.deleteHotel);

module.exports = router; 