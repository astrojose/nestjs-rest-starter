import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, HttpException, HttpStatus, Logger } from '@nestjs/common';
import type { Request, Response } from 'express';

interface ErrorResponse {
  status: number;
  message: string;
  timestamp: string;
  path: string;
  error: string | Record<string, unknown>;
  stack?: string | undefined;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Internal server error';
    let error: string | Record<string, unknown> =
      'An unexpected error occurred';

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const typedExceptionResponse = exceptionResponse as Record<
          string,
          unknown
        >;
        const rawErrors = typedExceptionResponse.errors;
        message =
          typeof typedExceptionResponse.message === 'string'
            ? typedExceptionResponse.message
            : exception.message;
        error =
          typeof rawErrors === 'string' ||
          (typeof rawErrors === 'object' && rawErrors !== null)
            ? (rawErrors as string | Record<string, unknown>)
            : exception.message;
      } else {
        message = exception.message;
        error = exceptionResponse;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      error = exception.name;
    }

    this.logger.error(
      `${request.method} ${request.url} - ${status} ${message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    const errorResponse: ErrorResponse = {
      status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      error,
    };

    if (process.env.NODE_ENV !== 'production' && exception instanceof Error) {
      errorResponse.stack = exception.stack;
    }

    response.status(status).json(errorResponse);
  }
}
