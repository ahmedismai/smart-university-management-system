import { entityItemRoute } from "@/lib/crudRoute";
import Parent from "@/models/Parent";
import Student from "@/models/Student";

// The form sends the linked student's ID (e.g. CSE2024001); store the matching record.
export const { GET, PUT, DELETE } = entityItemRoute(Parent, {
  beforeUpdate: async (body) => {
    if (body.studentRef !== undefined) {
      const ref = String(body.studentRef).trim();
      delete body.studentRef;
      if (ref) {
        const s: any = await Student.findOne({ studentId: ref.toUpperCase() }).lean();
        if (!s) return `No student found with ID ${ref}`;
        body.studentId = s._id;
      } else {
        body.studentId = null;
      }
    }
    return body;
  },
});
