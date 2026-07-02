const express = require('express');
const router = express.Router();
const {
  createClaimRequest,
  getMyClaims,
  getReceivedClaims,
  updateClaimStatus
} = require('../controllers/claimController');
const { protect } = require('../middleware/authMiddleware');

// All claim routes require authentication
router.use(protect);

router.post('/', createClaimRequest);
router.get('/my-claims', getMyClaims);
router.get('/received', getReceivedClaims);
router.put('/:id', updateClaimStatus);

module.exports = router;
