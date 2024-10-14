import { SetMetadata } from "@nestjs/common";

/**
 * ROLES_KEY is a constant that holds the metadata key for storing roles.
 * The Roles decorator is a function that takes a variable number of role strings
 * and uses the SetMetadata decorator to attach the roles to the route handler
 * using the ROLES_KEY.
 */
export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
