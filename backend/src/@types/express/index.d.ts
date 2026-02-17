import { WorkerRole } from "../../worker/types/enums/role.enum";

declare global {
  namespace Express {
    interface User {
      userId: string;
      email: string;
      role: WorkerRole;
      restaurantId: string;
      isFirstLogin: boolean;
    }
  }
}
