import mongoose from "mongoose";
import slugify from "slugify";

const AccountSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Account Must Have An Owner!"],
    },
    credit: {
      type: Number,
      min: [0, "Must have money in credit"],
      default: 0,
    },
    cash: {
      type: Number,
      default: 0,
    },
  },

  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      // Hide the _id and the __v field from the frontend
      transform: function (_, ret) {
        ret.id = ret._id;
        // delete ret._id;
        delete ret.__v;
      },
    },
    toObject: {
      virtuals: true,
      // Hide the _id and the __v field from the frontend
      transform: function (_, ret) {
        ret.id = ret._id;
        // delete ret._id;
        delete ret.__v;
      },
    },
  }
);

// Static method to get the user total balance
AccountSchema.statics.getTotalBalance = async function (ownerId) {
  const aggregationArr = await this.aggregate([
    {
      // $match stage filters documents to only include those with a matching ownerId
      $match: { owner: ownerId },
    },
    {
      // $group stage groups the documents by the owner field and calculates the sum of balances
      $group: {
        _id: "$owner",
        totalCash: { $sum: "$cash" },
        totalCredit: { $sum: "$credit" },
      },
    },
  ]);

  const totalCash = aggregationArr[0].totalCash;
  const totalCredit = aggregationArr[0].totalCredit;
  try {
    await this.model("User").findByIdAndUpdate(ownerId, {
      totalCash: totalCash,
      totalCredit: totalCredit,
    });
  } catch (err) {
    console.error(err);
    throw new Error("Error updating user total balance");
  }
};

export default mongoose.model("Account", AccountSchema);