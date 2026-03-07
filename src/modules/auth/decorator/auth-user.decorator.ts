import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import type { AuthUser as AuthUserPayload } from 'src/modules/auth/interfaces/auth-user.interface';

export const AuthUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthUserPayload => {
    const request = context
      .switchToHttp()
      .getRequest<{ user: AuthUserPayload }>();
    return request.user;
  },
);
