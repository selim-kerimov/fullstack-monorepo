import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import { UserCreateSchema, UserOutputSchema } from './users.schema.js';
import { TRPCError } from '@trpc/server';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAll() {
    return await this.databaseService.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: string): Promise<UserOutputSchema> {
    const user = await this.databaseService.user.findFirst({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new TRPCError({
        message: `User with ${id} does not found`,
        code: 'NOT_FOUND',
      });
    }

    return user;
  }

  async create(data: UserCreateSchema) {
    return await this.databaseService.user.create({
      data,
    });
  }

  async update(id: string, data: Partial<UserOutputSchema>) {
    const user = await this.databaseService.user.findFirst({
      where: { id },
    });

    if (!user) {
      throw new TRPCError({
        message: `User with ${id} does not found`,
        code: 'NOT_FOUND',
      });
    }

    return await this.databaseService.user.update({
      where: { id },
      data,
      select: {
        id: true,
        fullName: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async delete(id: string) {
    await this.databaseService.user.delete({
      where: { id },
    });

    return true;
  }
}
