import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ReservationService {
  constructor(private prisma: PrismaService) {}

  async reserve(userId: string, concertId: string) {
    const exists = await this.prisma.reservation.findFirst({
      where: { userId, concertId },
    });

    if (exists) {
      throw new Error('Reservation already exists');
    }

    const concert = await this.prisma.concert.findUnique({
      where: { id: concertId },
    });

    if (!concert || concert.availableSeats <= 0) {
      throw new Error('Concert not found or no available seats');
    }

    const [, newReservation] = await this.prisma.$transaction([
      this.prisma.concert.update({
        where: { id: concertId },
        data: { availableSeats: { decrement: 1 } },
      }),
      this.prisma.reservation.create({
        data: { userId, concertId },
      }),
    ]);

    return newReservation;
  }

  async cancel(userId: string, concertId: string) {
    const reservation = await this.prisma.reservation.findFirst({
      where: { userId, concertId },
    });

    if (!reservation) {
      throw new Error('Reservation not found');
    }

    const [, deletedReservation] = await this.prisma.$transaction([
      this.prisma.concert.update({
        where: { id: concertId },
        data: { availableSeats: { increment: 1 } },
      }),
      this.prisma.reservation.delete({
        where: { id: reservation.id },
      }),
    ]);

    return deletedReservation;
  }

  async history(userId: string) {
    return this.prisma.reservation.findMany({
      where: { userId },
    });
  }
}
