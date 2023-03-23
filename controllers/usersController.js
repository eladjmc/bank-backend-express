import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/User.js';

// @desc    Get all Shops
// @route   GET /api/v1/shops
// @access  Public
export const getShops = asyncHandler(async (req, res, next) => { 
  res.status(200).json(res.advancedResults);
});

// @desc    Create a Shop
// @route   POST /api/v1/shops
// @access  Private
export const createShop = asyncHandler(async (req, res, next) => {
  console.log(req.body);
  const shop = await Shop.create(req.body);

  res.status(200).json({
    success: true,
    data: shop,
  });
});

// @desc    Get a single Shop
// @route   GET /api/v1/shops/:id
// @access  Public
export const getShop = asyncHandler(async (req, res, next) => {
  const shop = await Shop.findById(req.params.id);

  if (!shop) {
    return next(new Error(`Shop that end with '${req.params.id.slice(-6)}' not found`));
  }

  res.status(200).json({
    success: true,
    data: shop,
  });
});

// @desc    Update a Shop
// @route   PUT /api/v1/shops/:id
// @access  Private
export const updateShop = asyncHandler(async (req, res, next) => {
  const shop = await Shop.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!shop) {
    return next(new Error(`Shop that end with '${req.params.id.slice(-6)}' not found`));
  }

  res.status(200).json({
    success: true,
    data: shop,
  });
});


// @desc    Delete a shop
// @route   DELETE /api/v1/shops/:id
// @access  Private
export const deleteShop = asyncHandler(async (req, res, next) => {
  const shop = await Shop.findById(req.params.id);

  if (!shop) {
    return next(new ErrorResponse(`Shop that ends with '${req.params.id.slice(-6)}' was not found`, 404));
  }

  shop.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});




