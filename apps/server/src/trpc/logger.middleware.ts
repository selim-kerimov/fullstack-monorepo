import { Injectable, Logger } from '@nestjs/common';
import { MiddlewareOptions, TRPCMiddleware } from 'nestjs-trpc';

@Injectable()
export class TrpcLoggerMiddleware implements TRPCMiddleware {
  private readonly logger = new Logger(TrpcLoggerMiddleware.name);

  async use(opts: MiddlewareOptions) {
    const start = Date.now();
    const { path, next, type, input } = opts;
    const result = await next();

    const meta = JSON.stringify({
      input,
      type,
      duration: Date.now() - start,
    });

    if (result.ok) {
      this.logger.log(meta, path);
    } else {
      this.logger.error(meta, path);
    }

    return result;
  }
}
