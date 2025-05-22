import { SetMetadata } from "@nestjs/common";
import { UserRole } from "src/users/enum/user-role.enum";

export const ROLES_KEY = 'roles';
// export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
export const Roles = (...roles:[UserRole,...UserRole[]]) => SetMetadata(ROLES_KEY, roles); // ? use type tuple to prevent empty roles list from being passed
