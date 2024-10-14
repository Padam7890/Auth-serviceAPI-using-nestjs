import { SetMetadata } from '@nestjs/common';

/**
 * PERMISSIONS_KEY is a constant that holds the metadata key for storing permissions.
 * The Permissions decorator is a function that takes a variable number of permission strings
 * and uses the SetMetadata decorator to attach the permissions to the route handler
 * using the PERMISSIONS_KEY.
 */
export const PERMISSIONS_KEY = 'permissions';
export const Permissions = (...permissions: string[]) => SetMetadata(PERMISSIONS_KEY, permissions);
