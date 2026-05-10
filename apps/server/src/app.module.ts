import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfilesModule } from './profiles/profiles.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { DatabaseService } from './database/database.service';
import { AuthModule } from './auth/auth.module';
import { LoggingService } from './common/logging/logging.service';
import { TRPCModule } from 'nestjs-trpc';

@Module({
  imports: [
    ProfilesModule,
    DatabaseModule,
    UsersModule,
    AuthModule,
    TRPCModule.forRoot({
      basePath: '../generated/trpc',
    }),
  ],
  controllers: [AppController],
  providers: [AppService, DatabaseService, LoggingService],
  exports: [LoggingService],
})
export class AppModule {}
