import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/modules/auth/decorator/roles.decorator';

type RequestUser = {
  role?: {
    name: string;
  };
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: RequestUser }>();
    const userRole = request.user?.role?.name;

    if (!userRole) {
      throw new ForbiddenException('Role is required to access this resource');
    }

    if (!requiredRoles.includes(userRole)) {
      throw new ForbiddenException('Insufficient role permissions');
    }

    return true;
  }
}
