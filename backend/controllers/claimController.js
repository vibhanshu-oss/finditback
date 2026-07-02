const ClaimRequest = require('../models/ClaimRequest');
const Item = require('../models/Item');

// @desc    Create a new claim request for an item
// @route   POST /api/claims
// @access  Private
const createClaimRequest = async (req, res, next) => {
  const { itemId, message } = req.body;

  try {
    if (!itemId || !message) {
      res.status(400);
      throw new Error('Please provide an item ID and a proof/claim message');
    }

    // Verify item exists
    const item = await Item.findById(itemId);
    if (!item) {
      res.status(404);
      throw new Error('Item not found');
    }

    // Prevent users from claiming resolved/claimed items
    if (item.status === 'Resolved' || item.status === 'Claimed') {
      res.status(400);
      throw new Error('This item has already been resolved or claimed');
    }

    // Prevent owners from claiming their own listings
    if (item.postedBy.toString() === req.user._id.toString()) {
      res.status(400);
      throw new Error('You cannot file a claim for your own listed item');
    }

    // Prevent duplicate claim requests by the same requester for the same item
    const duplicateClaim = await ClaimRequest.findOne({
      item: itemId,
      requester: req.user._id
    });
    if (duplicateClaim) {
      res.status(400);
      throw new Error('You have already submitted a claim request for this item');
    }

    const claim = await ClaimRequest.create({
      item: itemId,
      requester: req.user._id,
      message
    });

    res.status(201).json({
      success: true,
      data: claim
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get claim requests made by the current user
// @route   GET /api/claims/my-claims
// @access  Private
const getMyClaims = async (req, res, next) => {
  try {
    const claims = await ClaimRequest.find({ requester: req.user._id })
      .populate({
        path: 'item',
        populate: {
          path: 'postedBy',
          select: 'name email phone'
        }
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: claims.length,
      data: claims
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get claim requests received for items posted by the current user
// @route   GET /api/claims/received
// @access  Private
const getReceivedClaims = async (req, res, next) => {
  try {
    // 1. Find all items posted by this user
    const userItems = await Item.find({ postedBy: req.user._id });
    const itemIds = userItems.map(item => item._id);

    // 2. Find claim requests associated with these items
    const claims = await ClaimRequest.find({ item: { $in: itemIds } })
      .populate('item')
      .populate('requester', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: claims.length,
      data: claims
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update claim request status (Accept / Reject) (Item Owner Only)
// @route   PUT /api/claims/:id
// @access  Private
const updateClaimStatus = async (req, res, next) => {
  const { status } = req.body; // 'Accepted' or 'Rejected'

  try {
    if (!status || !['Accepted', 'Rejected'].includes(status)) {
      res.status(400);
      throw new Error('Please provide a valid status update: Accepted or Rejected');
    }

    // Find the claim request
    const claim = await ClaimRequest.findById(req.params.id).populate('item');
    if (!claim) {
      res.status(404);
      throw new Error('Claim request not found');
    }

    // Verify that the current user is the owner of the associated item
    if (claim.item.postedBy.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized: You do not own the item associated with this claim');
    }

    // Prevent double operations if claim is already decided
    if (claim.status !== 'Pending') {
      res.status(400);
      throw new Error(`This claim has already been resolved as: ${claim.status}`);
    }

    if (status === 'Accepted') {
      // 1. Accept this claim
      claim.status = 'Accepted';
      await claim.save();

      // 2. Reject all other pending claims for this item
      await ClaimRequest.updateMany(
        { item: claim.item._id, _id: { $ne: claim._id }, status: 'Pending' },
        { status: 'Rejected' }
      );

      // 3. Mark the item as Resolved
      await Item.findByIdAndUpdate(claim.item._id, { status: 'Resolved' });
    } else {
      // Reject this claim
      claim.status = 'Rejected';
      await claim.save();
    }

    res.json({
      success: true,
      message: `Claim request status successfully updated to ${status}`,
      data: claim
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createClaimRequest,
  getMyClaims,
  getReceivedClaims,
  updateClaimStatus
};
