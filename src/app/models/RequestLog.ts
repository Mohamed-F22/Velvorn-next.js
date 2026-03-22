import mongoose from "mongoose";

const RequestLogSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now, expires: 30 },
});

export const RequestLog =
  mongoose.models.RequestLog || mongoose.model("RequestLog", RequestLogSchema);
