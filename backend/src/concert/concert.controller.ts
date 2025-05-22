import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ConcertService } from './concert.service';
import { CreateConcertDto } from './dto/create-concert.dto';

@Controller('concerts')
export class ConcertController {
  constructor(private readonly concertService: ConcertService) {}

  @Post()
  create(@Body() body: CreateConcertDto) {
    return this.concertService.create(body);
  }

  @Get()
  findAll() {
    return this.concertService.findAll();
  }

  @Get('concert-stats')
  getStats() {
    return this.concertService.getConcertStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.concertService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.concertService.remove(id);
  }
}
