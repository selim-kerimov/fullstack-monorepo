import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { LoggingService } from '../logging/logging.service.js';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const { method, url, query, body } = request;
    const start = Date.now();

    this.logger.log({
      type: 'REQUEST',
      method,
      url,
      query,
      body,
    });

    return next.handle().pipe(
      tap(() => {
        this.logger.log({
          type: 'RESPONSE',
          method,
          url,
          statusCode: response.statusCode,
          duration: `${Date.now() - start}ms`,
        });
      }),
    );
  }
}
