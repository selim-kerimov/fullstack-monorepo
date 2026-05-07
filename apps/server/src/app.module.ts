import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { ProfilesModule } from './profiles/profiles.module.js';
import { DatabaseModule } from './database/database.module.js';
import { UsersModule } from './users/users.module.js';
import { DatabaseService } from './database/database.service.js';

@Module({
  imports: [ProfilesModule, DatabaseModule, UsersModule],
  controllers: [AppController],
  providers: [AppService, DatabaseService],
})
export class AppModule {}
