import { Input, Mutation, Query, Router, UseMiddlewares } from 'nestjs-trpc';
import { UsersService } from './users.service.js';
import {
  userCreateSchema,
  userOutputSchema,
  userUpdateInputSchema,
} from './users.schema.js';
import type { UserCreateSchema, UserOutputSchema } from './users.schema.js';
import z from 'zod';
import { TrpcLoggerMiddleware } from 'src/trpc/logger.middleware';

@Router({ alias: 'users' })
@UseMiddlewares(TrpcLoggerMiddleware)
export class UsersRouter {
  constructor(private readonly usersService: UsersService) {}

  // Get all
  @Query({
    output: z.array(userOutputSchema),
  })
  getAll() {
    return this.usersService.getAll();
  }

  // Find one
  @Query({
    input: z.object({ id: z.string() }),
    output: userOutputSchema,
  })
  findOne(@Input('id') id: string) {
    return this.usersService.findOne(id);
  }

  // Create
  @Mutation({
    input: userCreateSchema,
    output: userOutputSchema,
  })
  create(@Input() body: UserCreateSchema) {
    return this.usersService.create(body);
  }

  // Update
  @Mutation({
    input: userUpdateInputSchema,
    output: userOutputSchema,
  })
  update(
    @Input('id') id: string,
    @Input('data') data: Partial<UserOutputSchema>,
  ) {
    return this.usersService.update(id, data);
  }

  // Delete
  @Mutation({
    input: z.object({ id: z.string() }),
    output: z.boolean(),
  })
  delete(@Input('id') id: string) {
    return this.usersService.delete(id);
  }
}
