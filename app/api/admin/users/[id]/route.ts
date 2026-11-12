import bcrypt from "bcryptjs";
import { entityItemRoute } from "@/lib/crudRoute";
import User from "@/models/User";

// Passwords are only changed when a new one is sent, and are never returned.
export const { GET, PUT, DELETE } = entityItemRoute(User, {
  hide: "-password",
  beforeUpdate: async (body) => {
    if (body.password) {
      if (String(body.password).length < 6) return "Password must be at least 6 characters";
      body.password = await bcrypt.hash(String(body.password), 10);
    } else {
      delete body.password;
    }
    return body;
  },
});
