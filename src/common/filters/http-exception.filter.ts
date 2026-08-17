import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpException, HttpStatus, Logger } from '@nestjs/common';
import type { Request, Response } from 'express';

interface ErrorResponse {
  status: number;
  code: string;
  message: string;
  timestamp: string;
  path: string;
  error: unknown;
  stack?: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_SERVER_ERROR';
    let message = 'Internal server error';
    let error: unknown = 'An unexpected error occurred';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      code = this.getStatusCodeName(status);
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const typedResponse = exceptionResponse as Record<string, unknown>;
        message =
          typeof typedResponse.message === 'string'
            ? typedResponse.message
            : Array.isArray(typedResponse.message)
              ? typedResponse.message.join('; ')
              : exception.message;

        error = typedResponse.errors || typedResponse.error || message;
      } else {
        message = exception.message;
        error = exceptionResponse;
      }
    } else if (this.isTypeOrmError(exception)) {
      const dbErr = exception as {
        code?: string;
        detail?: string;
        message?: string;
      };
      switch (dbErr.code) {
        case '23505': // Unique constraint violation
          status = HttpStatus.CONFLICT;
          code = 'CONFLICT';
          message = dbErr.detail || 'Resource already exists';
          error = 'Unique constraint violation';
          break;
        case '23503': // Foreign key violation
          status = HttpStatus.BAD_REQUEST;
          code = 'BAD_REQUEST';
          message = dbErr.detail || 'Referenced resource does not exist';
          error = 'Foreign key constraint violation';
          break;
        case '22P02': // Invalid text representation (e.g. invalid UUID/int)
          status = HttpStatus.BAD_REQUEST;
          code = 'BAD_REQUEST';
          message = 'Invalid data format provided';
          error = 'Syntax error in request parameter';
          break;
        default:
          status = HttpStatus.INTERNAL_SERVER_ERROR;
          code = 'DATABASE_ERROR';
          message = 'Database operation failed';
          error = dbErr.message || 'Database error';
          break;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      error = exception.name;
    }

    this.logger.error(
      `${request.method} ${request.url} - ${status} [${code}] ${message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    const errorResponse: ErrorResponse = {
      status,
      code,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      error,
    };

    if (
      process.env.NODE_ENV !== 'production' &&
      exception instanceof Error &&
      exception.stack
    ) {
      errorResponse.stack = exception.stack;
    }

    response.status(status).json(errorResponse);
  }

  private isTypeOrmError(exception: unknown): boolean {
    return (
      typeof exception === 'object' &&
      exception !== null &&
      ('code' in exception || 'driverError' in exception)
    );
  }

  private getStatusCodeName(status: number): string {
    const statusCodes: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'UNPROCESSABLE_ENTITY',
      429: 'TOO_MANY_REQUESTS',
      500: 'INTERNAL_SERVER_ERROR',
      502: 'BAD_GATEWAY',
      503: 'SERVICE_UNAVAILABLE',
    };
    return statusCodes[status] || 'ERROR';
  }
}
