import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ProfilesModule } from './profiles/profiles.module.js';
import { DatabaseModule } from './database/database.module.js';
import { UsersModule } from './users/users.module.js';
import { DatabaseService } from './database/database.service.js';
import { AuthModule } from './auth/auth.module.js';
import { LoggingService } from './common/logging/logging.service.js';

@Module({
  imports: [ProfilesModule, DatabaseModule, UsersModule, AuthModule],
  controllers: [AppController],
  providers: [AppService, DatabaseService, LoggingService],
  exports: [LoggingService],
})
export class AppModule {}
