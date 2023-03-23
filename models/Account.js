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

export default mongoose.model("Account", AccountSchema);
