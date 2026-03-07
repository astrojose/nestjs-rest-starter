import type { ValidationError } from '@nestjs/common';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

function formatValidationErrors(
  errors: ValidationError[],
): Record<string, string[]> {
  const result: Record<string, string[]> = {};

  const traverse = (error: ValidationError, parentPath?: string): void => {
    const field = parentPath
      ? `${parentPath}.${error.property}`
      : error.property;

    if (error.constraints) {
      result[field] = Object.values(error.constraints);
    }

    if (error.children?.length) {
      error.children.forEach(child => traverse(child, field));
    }
  };

  errors.forEach(error => traverse(error));
  return result;
}

export class GlobalValidationPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: (errors: ValidationError[]) =>
        new BadRequestException({
          message: 'Validation failed for request payload',
          errors: formatValidationErrors(errors),
        }),
    });
  }
}
