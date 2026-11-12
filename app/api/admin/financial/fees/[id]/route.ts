import { entityItemRoute } from "@/lib/crudRoute";
import FeeHead from "@/models/FeeHead";

// Edit or remove a fee head (admin only).
export const { GET, PUT, DELETE } = entityItemRoute(FeeHead, {
  beforeUpdate: (body) => {
    if (body.amount !== undefined) {
      body.amount = Number(body.amount);
      if (!(body.amount >= 0)) return "Amount must be zero or more";
    }
    return body;
  },
});
