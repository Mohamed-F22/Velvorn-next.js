import { Schema, Document, model, models } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: { type: String, required: true },
  },
  { timestamps: true },
);

const userModel =
  models.user || model<IUser>("user", userSchema);

export default userModel;
