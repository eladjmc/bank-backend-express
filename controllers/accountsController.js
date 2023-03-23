import asyncHandler from "../middleware/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import Account from "../models/Account.js";

// @desc    Get all Accounts
// @route   GET /api/v1/Accounts
export const getAccounts = asyncHandler(async (req, res, next) => {
  const accounts = await Account.find();

  res.status(200).json({
    success: true,
    data: accounts,
  });
});

// @desc    Create a Account
// @route   POST /api/v1/Accounts
export const createAccount = asyncHandler(async (req, res, next) => {
  const account = await Account.create(req.body);

  res.status(200).json({
    success: true,
    data: `Account ${account.email} was added successfully`,
  });
});

// @desc    Delete a account
// @route   DELETE /api/v1/accounts/:id
export const deleteAccount = asyncHandler(async (req, res, next) => {
  const account = await Account.findById(req.params.id);
  if (!account) {
    return next(
      new ErrorResponse(
        `Account that ends with '${req.params.id.slice(-6)}' was not found`,
        404
      )
    );
  }
  const accountEmail = account.email;

  account.deleteOne();

  res.status(200).json({
    success: true,
    data: `Account with email: '${accountEmail}' was deleted`,
  });
});

// @desc    get a account
// @route   GET /api/v1/accounts/:id
export const getAccount = asyncHandler(async (req, res, next) => {
  const account = await Account.findById(req.params.id);
  if (!account) {
    return next(
      new ErrorResponse(
        `Account that ends with '${req.params.id.slice(-6)}' was not found`,
        404
      )
    );
  }

  res.status(200).json({
    success: true,
    data: account,
  });
});

// @desc    update a account cash
// @route   GET /api/v1/accounts/updateBalance/:id
export const updateBalance = asyncHandler(async (req, res, next) => {
  const accountId = req.params.id;
  const { credit = 0, cash = 0 } = req.body;

  const { credit: prevCredit, cash: prevCash } = await Account.findById(accountId);
  if (!prevCredit || !prevCash) {
    new ErrorResponse(`Account that ends with '${accountId}' was not found`, 404);
  }
  
  // runValidators will not work with $inc
  const account = await Account.findOneAndUpdate(
    { _id: accountId },
    { credit: credit + prevCredit, cash: cash + prevCash },
    { new: true, runValidators: true }
  );
  if (!account) {
    return next(
      new ErrorResponse(`Account that ends with '${accountId}' was not found`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: `Balance was Changed`,
  });
});

// @desc    get a account by query
// @route   GET /api/v1/accounts/GetAccountByQuery
export const getAccountByQuery = asyncHandler(async (req, res, next) => {
  const query = req.query;
  if (!query.hasOwnProperty("email") && !query.hasOwnProperty("accountID")) {
    return next(new ErrorResponse("Params can only be Email/accountID", 401));
  }
  const account = await Account.find(query);
  if (!account) {
    return next(new ErrorResponse(`Account with this params was not found`, 404));
  }

  res.status(200).json({
    success: true,
    data: account,
  });
});
