import asyncHandler from "../middleware/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import User from "../models/User.js";
import Account from "../models/Account.js";

// @desc    Get all Users
// @route   GET /api/v1/users
// @access  Public
export const getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find().populate({
    path: "accounts",
  });
  res.status(200).json({ data: users });
});

// @desc    Create a User
// @route   POST /api/v1/users
// @access  Private
export const createUser = asyncHandler(async (req, res, next) => {
  let user = await User.create(req.body);

  const account = await Account.create({ owner: user._id });

  user = await User.findByIdAndUpdate(
    user._id,
    {
      $push: { accounts: account._id },
    },
    { new: true }
  );

  res.status(200).json({
    success: true,
    data: { user, account },
  });
});

// @desc    Get a single User
// @route   GET /api/v1/users/:id
// @access  Public
export const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).populate({
    path: "accounts",
  });

  if (!user) {
    return next(
      new Error(`User that end with '${req.params.id.slice(-6)}' not found`)
    );
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

//@desc Get a User by Query
//@route GET /api/v1/users/getUserByQuery
//@access
export const getUserByQuery = asyncHandler(async (req, res, next) => {
  const query = req.query;
  if (!query.hasOwnProperty("email") && !query.hasOwnProperty("passportID")) {
    return next(new ErrorResponse("Params can only be Email/passportID"), 401);
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

// @desc    Delete a User
// @route   DELETE /api/v1/users/:id
// @access  Private
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

  const accounts = await Account.deleteMany({ owner: user._id });
  if (!accounts.acknowledged) {
    return next(
      new ErrorResponse(`Error occurred while deleting user accounts`, 400)
    );
  }

  user.deleteOne();

  res.status(200).json({
    success: true,
    data: "User and accounts removed",
  });
});
