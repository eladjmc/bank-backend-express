import asyncHandler from "../middleware/asyncHandler.js";
import ErrorResponse from "../utils/ErrorResponse.js";
import Account from "../models/Account.js";
import User from "../models/User.js";

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
  const { passportID } = req.body;

  let user = await User.findOne({ passportID });
  if (!user) {
    return next(
      new ErrorResponse(`Account that  with '${passportID}' was not found`, 404)
    );
  }
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
    data: `Account with id ending ...${account.id.slice(
      -6
    )} was added successfully`,
  });
});

// @desc    Delete a account
// @route   DELETE /api/v1/accounts/:id
export const deleteAccount = asyncHandler(async (req, res, next) => {
  const accountToRemoveId = req.params.id;
  const account = await Account.findById(accountToRemoveId);
  if (!account) {
    return next(
      new ErrorResponse(
        `Account that ends with '${accountToRemoveId.slice(-6)}' was not found`,
        404
      )
    );
  }
  let user = await User.findById(account.owner);
  if (user.accounts.length === 1) {
    return next(
      new ErrorResponse(
        `Account that ends with '${accountToRemoveId.slice(
          -6
        )}' cannot be deleted - user only has this account`,
        403
      )
    );
  }

  const updatedUser = await User.findByIdAndUpdate(
    account.owner,
    { $pull: { accounts: accountToRemoveId } },
    { new: true }
  );

  await account.deleteOne(); // delete the account document

  await Account.getTotalBalance(account.owner);

  res.status(200).json({
    success: true,
    data: `Account with ID: '${accountToRemoveId}' was deleted`,
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
// @route   put /api/v1/accounts/updateBalance/:id
export const updateBalance = asyncHandler(async (req, res, next) => {
  const accountId = req.params.id;
  const { credit = 0, cash = 0 } = req.body;

  const { credit: prevCredit, cash: prevCash } = await Account.findById(
    accountId
  );
  if (!prevCredit || !prevCash) {
    new ErrorResponse(
      `Account that ends with '${accountId}' was not found`,
      404
    );
  }

  // runValidators will not work with $inc
  const account = await Account.findOneAndUpdate(
    { _id: accountId },
    { credit: credit + prevCredit, cash: cash + prevCash },
    { new: true, runValidators: true }
  );
  if (!account) {
    return next(
      new ErrorResponse(
        `Account that ends with '${accountId}' was not found`,
        404
      )
    );
  }

  await Account.getTotalBalance(account.owner);
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
    return next(
      new ErrorResponse(`Account with this params was not found`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: account,
  });
});