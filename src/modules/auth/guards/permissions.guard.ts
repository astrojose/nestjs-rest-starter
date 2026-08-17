import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from 'src/modules/auth/decorator/permissions.decorator';
import { RedisService } from 'src/database/redis/redis.service';

type UserPermission = {
  name: string;
};

type RequestUser = {
  role?: {
    name?: string;
    permissions?: UserPermission[];
  };
};

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly redisService: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user?: RequestUser }>();
    const userRole = request.user?.role?.name;
    const userPermissions =
      request.user?.role?.permissions?.map(permission => permission.name) ?? [];

    let hasAllPermissions = true;

    for (const permission of requiredPermissions) {
      let isAllowed: boolean | null = null;

      if (userRole && this.redisService.isAvailable) {
        isAllowed = await this.redisService.isPermissionInRole(
          userRole,
          permission,
        );
      }

      // If Redis returned null (unavailable/cache miss), fall back to in-memory/JWT permissions
      if (isAllowed === null) {
        isAllowed = userPermissions.includes(permission);
      }

      if (!isAllowed) {
        hasAllPermissions = false;
        break;
      }
    }

    if (!hasAllPermissions) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}
