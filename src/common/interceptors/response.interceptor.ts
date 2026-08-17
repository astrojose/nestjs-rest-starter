import type {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginationMeta } from '../utils/pagination';

export interface ResponseEnvelope<T> {
  status: number;
  message: string;
  timestamp: string;
  path: string;
  data: T;
  pagination?: PaginationMeta;
  meta?: Record<string, unknown>;
}

@Injectable()
export class ResponseTransformInterceptor<T> implements NestInterceptor<
  T,
  ResponseEnvelope<T>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseEnvelope<T>> {
    const request = context.switchToHttp().getRequest<{ url: string }>();
    const response = context.switchToHttp().getResponse<{
      statusCode: number;
      req: { url: string };
    }>();

    const excludedRoutes: string[] = [];

    if (excludedRoutes.includes(response.req.url)) {
      return next.handle();
    }

    return next.handle().pipe(
      map((data: unknown): ResponseEnvelope<T> => {
        const defaultMessage = 'Success';

        const createMeta = (message: string) => ({
          status: response.statusCode,
          message,
          timestamp: new Date().toISOString(),
          path: request.url,
        });

        // Check if payload is paginated
        const isPaginated =
          Boolean(data) &&
          typeof data === 'object' &&
          'pagination' in (data as Record<string, unknown>) &&
          'data' in (data as Record<string, unknown>);

        if (isPaginated) {
          const paginatedData = data as {
            data: T;
            pagination: PaginationMeta;
            meta?: Record<string, unknown>;
          };
          return {
            ...createMeta(defaultMessage),
            data: paginatedData.data,
            pagination: paginatedData.pagination,
            ...(paginatedData.meta ? { meta: paginatedData.meta } : {}),
          };
        }

        // Promote message if present in response object
        if (data && typeof data === 'object' && 'message' in data) {
          const dataRecord = { ...(data as Record<string, unknown>) };
          const rawMessage = dataRecord.message;
          delete dataRecord.message;

          const trimmedMessage =
            typeof rawMessage === 'string' ? rawMessage.trim() : '';

          const finalMessage = trimmedMessage || defaultMessage;
          const payloadData =
            'data' in dataRecord ? (dataRecord.data as T) : (dataRecord as T);

          return {
            ...createMeta(finalMessage),
            data: payloadData,
          };
        }

        return {
          ...createMeta(defaultMessage),
          data: data as T,
        };
      }),
    );
  }
}
