import { entityItemRoute } from "@/lib/crudRoute";
import Student from "@/models/Student";
import User from "@/models/User";

// Keep the login account in step with the student record.
export const { GET, PUT, DELETE } = entityItemRoute(Student, {
  afterUpdate: async (doc, before) => {
    await User.updateOne(
      { email: before.email, role: "Student" },
      { email: doc.email, name: doc.name, status: doc.status === "Active" ? "Active" : "Inactive" }
    );
  },
  afterDelete: async (doc) => {
    await User.deleteOne({ email: doc.email, role: "Student" });
  },
});
