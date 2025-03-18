import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerValidationDto } from 'src/dto/playerDto';

@Controller('player')
export class PlayerController {
  constructor(private playerService: PlayerService) {}
  @Get('all')
  getAllPlayers() {
    return this.playerService.getAllPlayers();
  }

  @Get(':id')
  getPlayerById(@Param('id', ParseIntPipe) id, @Query('slug') slug) {
    return id + ' ' + slug;
  }

  @Post()
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  create(@Body() body: PlayerValidationDto) {
    return body;
  }
  @Patch()
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  update(@Body() body: PlayerValidationDto) {
    return body;
  }
}
