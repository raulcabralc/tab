import { SetMetadata } from "@nestjs/common";
import { WorkerRole } from "../../worker/types/enums/role.enum";

export const ROLES_KEY = "roles";
export const Roles = (...roles: WorkerRole[]) => SetMetadata(ROLES_KEY, roles);
