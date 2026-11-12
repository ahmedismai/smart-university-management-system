import { redirect } from "next/navigation";

export default function MarksIndex() {
  redirect("/admin/marks/upload");
}
