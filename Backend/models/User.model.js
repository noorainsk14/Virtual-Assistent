import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      uniquie: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      uniquie: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    assistantName: {
      type: String,
    },
    assistantImage: {
      type: String,
    },
    history: [{ type: String }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
