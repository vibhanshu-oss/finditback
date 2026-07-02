const Item = require('../models/Item');

// @desc    Create a new lost/found item listing
// @route   POST /api/items
// @access  Private
const createItem = async (req, res, next) => {
  const {
    title,
    description,
    category,
    status,
    type,
    location,
    date,
    imageUrl,
    contactPreference
  } = req.body;

  try {
    // Resolve status and type from either field sent by frontend
    // Frontend AddItem sends 'status' field (Lost or Found)
    // type = Lost/Found classification, status = lifecycle state
    const resolvedStatus = status || type || 'Lost';
    // type must be either Lost or Found (derived from status if status is one of those)
    const resolvedType = type || (['Lost', 'Found'].includes(resolvedStatus) ? resolvedStatus : 'Lost');

    if (!title || !description || !category || !resolvedStatus || !location || !date || !contactPreference) {
      res.status(400);
      throw new Error('Please fill in all required fields');
    }

    const item = await Item.create({
      title,
      description,
      category,
      type: resolvedType,
      status: resolvedStatus,
      location,
      date,
      imageUrl: imageUrl || '',
      contactPreference,
      postedBy: req.user._id
    });

    res.status(201).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};



// @desc    Get all items with search, filter, and sort options
// @route   GET /api/items
// @access  Public
const getItems = async (req, res, next) => {
  try {
    const { search, category, status, type, sortBy, order } = req.query;
    let queryObj = {};

    // Apply Search matching title, description or location
    if (search) {
      queryObj.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    // Apply exact filter categories
    if (category) {
      queryObj.category = category;
    }

    // Support ?type=Lost or ?type=Found (filters on item type classification field)
    if (type) {
      queryObj.type = type;
    }

    // Apply status filter (lifecycle: Lost/Found/Claimed/Resolved)
    if (status) {
      queryObj.status = status;
    }

    // Define Sorting configuration
    let sortObj = {};
    if (sortBy) {
      const sortDirection = order === 'asc' ? 1 : -1;
      sortObj[sortBy] = sortDirection;
    } else {
      sortObj.createdAt = -1; // Default: Newest first
    }

    // Fetch items with populated user information
    const items = await Item.find(queryObj)
      .sort(sortObj)
      .populate('postedBy', 'name email phone');

    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single item details by ID
// @route   GET /api/items/:id
// @access  Public
const getItemById = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id).populate('postedBy', 'name email phone');

    if (!item) {
      res.status(404);
      throw new Error('Item not found');
    }

    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an item listing (Owner Only)
// @route   PUT /api/items/:id
// @access  Private
const updateItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      res.status(404);
      throw new Error('Item not found');
    }

    // Owner protection verification
    if (item.postedBy.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized: You are not the owner of this listing');
    }

    // Update item details
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('postedBy', 'name email phone');

    res.json({
      success: true,
      data: updatedItem
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an item listing (Owner Only)
// @route   DELETE /api/items/:id
// @access  Private
const deleteItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      res.status(404);
      throw new Error('Item not found');
    }

    // Owner protection verification
    if (item.postedBy.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized: You are not the owner of this listing');
    }

    // Delete item
    await item.deleteOne();

    res.json({
      success: true,
      message: 'Item listing deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get items posted by current authenticated user
// @route   GET /api/items/my-listings
// @access  Private
const getMyListings = async (req, res, next) => {
  try {
    const items = await Item.find({ postedBy: req.user._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  getMyListings
};
