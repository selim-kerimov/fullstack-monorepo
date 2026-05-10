import { Input, Mutation, Query, Router } from 'nestjs-trpc';
import { UsersService } from './users.service.js';
import { userCreateSchema, userOutputSchema } from './users.schema.js';
import type { UserCreateBody } from './users.schema.js';

@Router({ alias: 'users' })
export class UsersRouter {
  constructor(private readonly usersService: UsersService) {}

  @Query()
  getAll() {
    return this.usersService.getAll();
  }

  @Mutation({
    input: userCreateSchema,
    output: userOutputSchema,
  })
  create(@Input() body: UserCreateBody) {
    return this.usersService.create(body);
  }
}
