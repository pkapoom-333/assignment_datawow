import { Body, Controller, Get, Post, Put, Query } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReserveSeatDto } from './dto/reserve-seat.dto';
import { UserHistoryDto } from './dto/user-history.dto';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  reserve(@Body() body: ReserveSeatDto) {
    return this.reservationService.reserve(body.userId, body.concertId);
  }

  @Put()
  cancel(@Body() body: ReserveSeatDto) {
    return this.reservationService.cancel(body.userId, body.concertId);
  }

  @Get('user-actions')
  history(@Query('userId') userId: string) {
    return this.reservationService.history(userId);
  }
}
