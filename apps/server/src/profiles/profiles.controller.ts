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
} from '@nestjs/common';
import { ProfileCreateDto } from './dto/profileCreateDto';
import { ProfileUpdateDto } from './dto/profileUpdateDto';
import { ProfilesService } from './profiles.service';
import type { UUID } from 'crypto';

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
  delete(@Param('id', ParseUUIDPipe) id: UUID) {
    return this.service.delete(id);
  }
}
