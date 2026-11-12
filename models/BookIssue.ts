import mongoose from "mongoose";

const BookIssueSchema = new mongoose.Schema(
  {
    book: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
    memberId: { type: String, required: true },
    memberType: { type: String, enum: ["Student", "Staff", "Teacher"], default: "Student" },
    issueDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    returnDate: { type: Date },
    status: { type: String, enum: ["Active", "Overdue", "Returned"], default: "Active" },
  },
  { timestamps: true }
);

export default mongoose.models.BookIssue || mongoose.model("BookIssue", BookIssueSchema);
