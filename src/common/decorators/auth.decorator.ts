import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/modules/auth/guards/permissions.guard';
import { Permissions } from 'src/modules/auth/decorator/permissions.decorator';
import { ApiBearerAuth } from './swagger.decorators';

/**
 * Composite Auth decorator.
 * Applies JwtAuthGuard, PermissionsGuard, Swagger Bearer Auth,
 * and sets required permissions if specified.
 *
 * @example
 * \@Auth() // Requires valid JWT
 * \@Auth('view-users') // Requires valid JWT + 'view-users' permission
 */
export function Auth(...permissions: string[]) {
  const decorators: Array<
    ClassDecorator | MethodDecorator | PropertyDecorator
  > = [UseGuards(JwtAuthGuard, PermissionsGuard), ApiBearerAuth()];

  if (permissions.length > 0) {
    decorators.push(Permissions(...permissions));
  }

  return applyDecorators(...decorators);
}
