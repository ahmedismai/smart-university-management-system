import mongoose from "mongoose";

const BookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    isbn: { type: String, unique: true },
    category: { type: String },
    copies: { type: Number, default: 1 },
    availableCopies: { type: Number, default: 1 },
    location: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Book || mongoose.model("Book", BookSchema);
