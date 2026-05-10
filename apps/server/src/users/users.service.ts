import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import { UserCreateBody } from './users.schema.js';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAll() {
    return await this.databaseService.user.findMany();
  }

  async create(data: UserCreateBody) {
    return await this.databaseService.user.create({
      data,
    });
  }
}
