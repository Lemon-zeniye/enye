import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { QueryFailedError, EntityNotFoundError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const isProduction = process.env.NODE_ENV === 'production';

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorCode: string | null = null;

    // Log all errors
    this.logger.error(
      `Exception: ${exception.message}`,
      exception.stack,
      `${request.method} ${request.url}`,
    );

    // 1️⃣ HttpExceptions (Nest built-in + class-validator)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (Array.isArray((res as any).message)) {
        message = (res as any).message.join(', ');
      } else {
        message = (res as any).message || message;
      }
      errorCode = 'HTTP_EXCEPTION';
    }

    // 2️⃣ TypeORM EntityNotFound
    else if (exception instanceof EntityNotFoundError) {
      status = HttpStatus.NOT_FOUND;
      message = 'Requested resource not found.';
      errorCode = 'ENTITY_NOT_FOUND';
    }

    // 3️⃣ Postgres Errors
    else if (exception.code) {
      errorCode = `DB_${exception.code}`;
      switch (exception.code) {
        case '23505':
          status = HttpStatus.CONFLICT;
          message = 'Duplicate record exists.';
          break;
        case '23503':
          status = HttpStatus.BAD_REQUEST;
          message = 'Related record constraint violation.';
          break;
        case '23502':
          status = HttpStatus.BAD_REQUEST;
          message = 'Required field missing.';
          break;
        case '22P02':
          status = HttpStatus.BAD_REQUEST;
          message = 'Invalid input format.';
          break;
        default:
          status = HttpStatus.INTERNAL_SERVER_ERROR;
          message = isProduction
            ? 'Database error occurred.'
            : exception.message;
          break;
      }
    }

    // 4️⃣ TypeORM Query Errors
    else if (exception instanceof QueryFailedError) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = isProduction ? 'Database operation failed.' : exception.message;
      errorCode = 'QUERY_FAILED';
    }

    // 5️⃣ Build response
    const responseBody: any = {
      success: false,
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
      errorCode,
    };

    response.status(status).json(responseBody);
  }

  private sanitizeError(exception: any): any {
    const sanitized = { ...exception };
    // Remove potentially sensitive information
    delete sanitized.headers;
    delete sanitized.config;
    delete sanitized.response;
    return sanitized;
  }
}
