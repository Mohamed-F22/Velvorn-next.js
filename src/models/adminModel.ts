import { Document, Schema, model, models } from "mongoose";

export type AdminRole = "admin" | "staff";

export interface IAdmin extends Document {
  fullName: string;
  email: string;
  password: string;
  role: AdminRole;
  createdAt: Date;
  updatedAt: Date;
}

const adminSchema = new Schema<IAdmin>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["admin", "staff"], required: true, default: "staff" },
  },
  { timestamps: true },
);

const adminModel = models.admin || model<IAdmin>("admin", adminSchema);

export default adminModel;
