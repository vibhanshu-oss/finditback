const express = require('express');
const router = express.Router();
const {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  getMyListings
} = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');

// Get user-specific listings (Must be placed BEFORE /:id to prevent route clash)
router.get('/my-listings', protect, getMyListings);

// Standard REST endpoints
router.route('/')
  .post(protect, createItem)
  .get(getItems);

router.route('/:id')
  .get(getItemById)
  .put(protect, updateItem)
  .delete(protect, deleteItem);

module.exports = router;
