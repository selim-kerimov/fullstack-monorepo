import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProfileCreateDto } from './dto/profileCreateDto.js';
import { ProfileUpdateDto } from './dto/profileUpdateDto.js';
import { ProfilesService } from './profiles.service.js';
import type { UUID } from 'crypto';
import { ProfilesGuard } from './profiles.guard.js';

@Controller('profiles')
export class ProfilesController {
  constructor(private service: ProfilesService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: UUID) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() body: ProfileCreateDto) {
    return this.service.create(body);
  }

  @Put(':id')
  update(@Param('id', ParseUUIDPipe) id: UUID, @Body() body: ProfileUpdateDto) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(ProfilesGuard)
  delete(@Param('id', ParseUUIDPipe) id: UUID) {
    return this.service.delete(id);
  }
}
