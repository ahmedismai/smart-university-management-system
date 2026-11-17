import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import ClassModel from "@/models/Class";
import Section from "@/models/Section";
import Student from "@/models/Student";
import User from "@/models/User";
import Application from "@/models/Application";
import ApplicationDocument from "@/models/ApplicationDocument";
import StudentDocument from "@/models/StudentDocument";

export class AdmissionError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

/** A readable temporary password, e.g. "Ngu-7KQ4-PX2M". */
export function generateTempPassword() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const pick = (n: number) =>
    Array.from(crypto.randomBytes(n), (b) => alphabet[b % alphabet.length]).join("");
  return `Ngu-${pick(4)}-${pick(4)}`;
}

/** Next free student ID for a program, following the existing pattern CSE2026001. */
async function nextStudentId(code: string) {
  const prefix = `${code}${new Date().getFullYear()}`;
  const last: any = await Student.findOne({ studentId: { $regex: `^${prefix}\\d+$` } })
    .sort({ studentId: -1 })
    .select("studentId")
    .lean();
  const n = last ? parseInt(last.studentId.slice(prefix.length), 10) + 1 : 1;
  return `${prefix}${String(n).padStart(3, "0")}`;
}

/**
 * Turns an accepted application into a real student: creates the Student record,
 * places them in the least-full active section of the program, creates a login
 * with a temporary password and copies their admission documents to their profile.
 * Returns the new student ID, and a temporary password only when the applicant did not choose one.
 */
export async function enrollApplicant(application: any, programCode: string) {
  if (application.studentId) {
    throw new AdmissionError(`Already enrolled as ${application.studentId}`, 409);
  }

  const cls: any = await ClassModel.findOne({ code: programCode }).lean();
  if (!cls) throw new AdmissionError("Please choose a valid program to enroll the applicant in");

  const email = String(application.email).toLowerCase();
  if (await Student.exists({ email })) {
    throw new AdmissionError("A student with this email already exists", 409);
  }
  if (await User.exists({ email })) {
    throw new AdmissionError("An account with this email already exists", 409);
  }

  const sections: any[] = await Section.find({ classId: cls._id, status: { $ne: "Inactive" } }).lean();
  let sectionId;
  if (sections.length) {
    const counts = await Promise.all(sections.map((s) => Student.countDocuments({ sectionId: s._id })));
    sectionId = sections[counts.indexOf(Math.min(...counts))]._id;
  }

  // Retry a few times in case two admins accept applicants of the same program at once.
  let student: any;
  for (let attempt = 0; attempt < 3 && !student; attempt++) {
    try {
      student = await Student.create({
        name: application.fullName,
        email,
        studentId: await nextStudentId(cls.code),
        classId: cls._id,
        sectionId,
        phone: application.phone || "",
        address: application.address || "",
        status: "Active",
      });
    } catch (e: any) {
      if (e?.code !== 11000 || !String(e.message).includes("studentId")) throw e;
    }
  }
  if (!student) throw new AdmissionError("Could not allocate a student ID, please try again", 500);

  // Applicants choose their password when applying; older applications without one get a
  // temporary password that the admin hands over.
  const withPassword: any = await Application.findById(application._id).select("+passwordHash").lean();
  const tempPassword = withPassword?.passwordHash ? null : generateTempPassword();
  try {
    await User.create({
      name: student.name,
      email,
      role: "Student",
      department: cls.code,
      password: withPassword?.passwordHash || (await bcrypt.hash(tempPassword as string, 10)),
      status: "Active",
    });
  } catch (e) {
    await Student.deleteOne({ _id: student._id });
    throw e;
  }

  // Copy the admission documents to the new student's profile.
  const docs: any[] = await ApplicationDocument.find({ applicationId: application._id }).lean();
  if (docs.length) {
    await StudentDocument.insertMany(
      docs.map((d) => ({
        studentId: student._id,
        fileName: d.fileName,
        mimeType: d.mimeType,
        size: d.size,
        data: d.data,
      }))
    );
  }

  await Application.updateOne(
    { _id: application._id },
    {
      status: "Accepted",
      programCode: cls.code,
      department: cls.name,
      studentId: student.studentId,
      enrolledAt: new Date(),
    }
  );

  return { studentId: student.studentId as string, tempPassword, program: cls.name as string };
}
