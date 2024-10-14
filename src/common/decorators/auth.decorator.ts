import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { RoleGuard } from '../../core/guards/role.guard';
import { Roles } from './roles.decorator';
import { JwtAuthGuard } from 'src/core/guards/auth.guard';

/**
 * Auth decorator function
 * @param role The role required to access the decorated route
 * @returns A combination of decorators that apply authentication and authorization guards and metadata
 * 
 * This function applies the following decorators:
 * - UseGuards(JwtAuthGuard, RoleGuard): Applies the JwtAuthGuard to ensure the user is authenticated with a valid JWT token, and the RoleGuard to check if the user has the required role.
 * - Roles(role): Sets the metadata for the required role using the @Roles decorator.
 * - ApiBearerAuth(): Adds the "Bearer" security scheme to the Swagger documentation for the decorated route.
 * 
 * By using this Auth decorator, the decorated route will require authentication with a JWT token and authorization based on the specified role.
 */

export function Auth(role: string) {
  return applyDecorators(
    UseGuards(JwtAuthGuard ,RoleGuard),
    Roles(role),
    ApiBearerAuth('JWT-auth')
  );
}


