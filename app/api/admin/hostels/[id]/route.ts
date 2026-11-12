import { entityItemRoute } from "@/lib/crudRoute";
import Hostel from "@/models/Hostel";

// Edit capacity / status of a hostel or remove it (admin only).
export const { GET, PUT, DELETE } = entityItemRoute(Hostel, {
  beforeUpdate: (body) => {
    if (body.capacity !== undefined) body.capacity = Number(body.capacity);
    if (body.occupied !== undefined) body.occupied = Number(body.occupied);
    if (body.capacity !== undefined && body.occupied !== undefined && body.occupied > body.capacity) {
      return "Occupied beds cannot exceed the capacity";
    }
    if (body.capacity !== undefined && body.occupied !== undefined) {
      body.status = body.status === "Maintenance" ? "Maintenance" : body.occupied >= body.capacity ? "Full" : "Available";
    }
    return body;
  },
});
