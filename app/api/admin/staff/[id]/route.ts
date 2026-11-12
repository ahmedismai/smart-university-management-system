import { entityItemRoute } from "@/lib/crudRoute";
import Staff from "@/models/Staff";

export const { GET, PUT, DELETE } = entityItemRoute(Staff);
