import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { DatabaseService } from './database/database.service';
import { AuthModule } from './auth/auth.module';
import { LoggingService } from './common/logging/logging.service';
import { TRPCModule } from 'nestjs-trpc';
import { TrpcLoggerMiddleware } from './trpc/logger.middleware';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AuthModule,
    TRPCModule.forRoot({
      basePath: '/trpc',
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    DatabaseService,
    LoggingService,
    TrpcLoggerMiddleware,
  ],
  exports: [LoggingService],
})
export class AppModule {}
