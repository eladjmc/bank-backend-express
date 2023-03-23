import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    userID: {
      type: String,
      required: [true, "Please Insert your ID"],
      trim: true,
      length: [9, "ID must contain 9 Chars"],
      match: [/^\d{9}$/, "ID must be only digits"],
    },
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
      maxlength: [35, "Name can not be more than 35 characters"],
    },
    email: {
      type: String,
      unique: [true, "Email already exist"],
      required: [true, "Please add a Email"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    age: {
      type: Number,
      required: [true, "Please Insert Age"],
      min: [18, "You need to be over 18 to open an account"],
    },
    accounts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
      },
    ],
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

export default mongoose.model("User", UserSchema);
