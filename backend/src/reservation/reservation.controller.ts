import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
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

  @Delete()
  cancel(@Body() body: ReserveSeatDto) {
    return this.reservationService.cancel(body.userId, body.concertId);
  }

  @Get()
  history(@Body() body: UserHistoryDto) {
    return this.reservationService.history(body.userId);
  }
}
