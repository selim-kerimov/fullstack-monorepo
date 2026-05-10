import { Module } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { UsersRouter } from './users.router.js';

@Module({
  providers: [UsersService, UsersRouter],
})
export class UsersModule {}
