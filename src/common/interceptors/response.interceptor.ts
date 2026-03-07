import type {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  status: number;
  message: string;
  timestamp: string;
  path: string;
  data: T;
  pagination?: {
    total: number;
    page: number;
    pageSize: number;
  };
  meta?: Record<string, unknown> | undefined;
}

interface PaginatedPayload<T> {
  data: T;
  pagination: {
    total: number;
    page: number;
    pageSize: number;
  };
  meta?: Record<string, unknown> | undefined;
}

@Injectable()
export class ResponseTransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const request = context.switchToHttp().getRequest<{ url: string }>();
    const response = context.switchToHttp().getResponse<{
      statusCode: number;
      req: { url: string };
    }>();
    const excludedRoutes = ['/'];

    if (excludedRoutes.includes(response.req.url)) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data): Response<T> => {
        const createMeta = () => ({
          status: response.statusCode,
          message: 'Success',
          timestamp: new Date().toISOString(),
          path: request.url,
        });

        const dataWithMeta = data as T & { meta?: Record<string, unknown> };
        const isPaginated = Boolean(
          data &&
            typeof data === 'object' &&
            'pagination' in (data as Record<string, unknown>),
        );

        if (isPaginated) {
          const paginatedData = data as PaginatedPayload<T>;
          return {
            ...createMeta(),
            data: paginatedData.data,
            pagination: paginatedData.pagination,
            meta: paginatedData.meta ?? {},
          };
        }

        return {
          ...createMeta(),
          data: data as T,
          meta: dataWithMeta.meta ?? {},
        };
      }),
    );
  }
}
