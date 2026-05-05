import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { ProfileCreateDto } from './dto/profileCreateDto';
import { ProfileUpdateDto } from './dto/profileUpdateDto';

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
    return this.profiles.find((i) => i.id == id);
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
    this.profiles = this.profiles.map((item) => {
      if (item.id === id) return { ...item, ...data };
      else return item;
    });

    return { id, ...data };
  }

  delete(id: string) {
    const foundProfileId = this.profiles.findIndex((i) => i.id == id);
    this.profiles.splice(foundProfileId, 1);
  }
}
