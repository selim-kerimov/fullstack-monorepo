import { Injectable } from '@nestjs/common';
import { ContextOptions, TRPCContext } from 'nestjs-trpc';

@Injectable()
export class TrpcAppContext implements TRPCContext {
  create(opts: ContextOptions) {
    return {
      req: opts.req,
      res: opts.res,
    };
  }
}
