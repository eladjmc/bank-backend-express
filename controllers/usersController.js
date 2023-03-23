import asyncHandler from "../middleware/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import User from "../models/User.js";

// @desc    Get all Users
// @route   GET /api/v1/Users
export const getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    data: users,
  });
});

// @desc    Create a User
// @route   POST /api/v1/Users
export const createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(200).json({
    success: true,
    data: `User ${user.email} was added successfully`,
  });
});

// @desc    Delete a user
// @route   DELETE /api/v1/users/:id
export const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorResponse(
        `User that ends with '${req.params.id.slice(-6)}' was not found`,
        404
      )
    );
  }
  const userEmail = user.email;

  user.deleteOne();

  res.status(200).json({
    success: true,
    data: `User with email: '${userEmail}' was deleted`,
  });
});

// @desc    get a user
// @route   GET /api/v1/users/:id
export const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      new ErrorResponse(
        `User that ends with '${req.params.id.slice(-6)}' was not found`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc    update a user cash
// @route   GET /api/v1/users/updateBalance/:id
export const updateBalance = asyncHandler(async (req, res, next) => {
  const userId = req.params.id;
  const { credit = 0, cash = 0 } = req.body;

  const { credit: prevCredit, cash: prevCash } = await User.findById(userId);
  if (!prevCredit || !prevCash) {
    new ErrorResponse(`User that ends with '${userId}' was not found`, 404);
  }
  
  // runValidators will not work with $inc
  const user = await User.findOneAndUpdate(
    { _id: userId },
    { credit: credit + prevCredit, cash: cash + prevCash },
    { new: true, runValidators: true }
  );
  if (!user) {
    return next(
      new ErrorResponse(`User that ends with '${userId}' was not found`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: `Balance was Changed`,
  });
});

// @desc    get a user by query
// @route   GET /api/v1/users/GetUserByQuery
export const getUserByQuery = asyncHandler(async (req, res, next) => {
  const query = req.query;
  if (!query.hasOwnProperty("email") && !query.hasOwnProperty("userID")) {
    return next(new ErrorResponse("Params can only be Email/userID", 401));
  }
  const user = await User.find(query);
  if (!user) {
    return next(new ErrorResponse(`User with this params was not found`, 404));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});
