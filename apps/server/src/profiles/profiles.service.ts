import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ProfileCreateDto } from './dto/profileCreateDto.js';
import { ProfileUpdateDto } from './dto/profileUpdateDto.js';

@Injectable()
export class ProfilesService {
  private profiles = [
    {
      id: randomUUID(),
      firstName: 'Selim',
      lastName: 'Kerimov',
    },
    {
      id: randomUUID(),
      firstName: 'Eziz',
      lastName: 'Tadjiev',
    },
    {
      id: randomUUID(),
      firstName: 'Kerim',
      lastName: 'Atayev',
    },
  ];

  findAll() {
    return this.profiles;
  }

  findOne(id: string) {
    const foundItem = this.profiles.find((i) => i.id == id);

    if (!foundItem) {
      throw new NotFoundException(`Profile with ID ${id} not found!`);
    }

    return foundItem;
  }

  create(data: ProfileCreateDto) {
    const item = {
      id: randomUUID(),
      ...data,
    };

    this.profiles.push(item);
    return item;
  }

  update(id: string, data: ProfileUpdateDto) {
    const foundIndex = this.profiles.findIndex((i) => i.id == id);

    if (foundIndex == -1) {
      throw new NotFoundException(`Profile with ID ${id} not found!`);
    }

    this.profiles[foundIndex].firstName = data.firstName;
    this.profiles[foundIndex].lastName = data.lastName;

    return this.profiles[foundIndex];
  }

  delete(id: string) {
    const foundIndex = this.profiles.findIndex((i) => i.id == id);

    if (foundIndex == -1) {
      throw new NotFoundException(`Profile with ID ${id} not found!`);
    }

    this.profiles.splice(foundIndex, 1);
  }
}
