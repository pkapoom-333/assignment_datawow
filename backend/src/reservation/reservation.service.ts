import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ReservationService {
  constructor(private prisma: PrismaService) {}

  async reserve(userId: string, concertId: string) {
    const reservation = await this.prisma.reservation.findFirst({
      where: { userId, concertId },
    });

    if (reservation) {
      if (reservation.status === 'CANCELED') {
        const [, newReservation] = await this.prisma.$transaction([
          this.prisma.concert.update({
            where: { id: concertId },
            data: { availableSeats: { increment: 1 } },
          }),
          this.prisma.reservation.update({
            where: { id: reservation.id },
            data: { status: 'CONFIRMED' },
          }),
        ]);

        await this.prisma.userActionLog.create({
          data: {
            userId,
            action: 'restore reservation',
          },
        });

        return newReservation;
      } else {
        throw new Error('Reservation already exists');
      }
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

    await this.prisma.userActionLog.create({
      data: {
        userId,
        action: 'Reserve concert',
        details: `Concert: ${concert.name}`,
      },
    });

    return newReservation;
  }

  async cancel(userId: string, concertId: string) {
    const reservation = await this.prisma.reservation.findFirst({
      where: {
        userId,
        concertId,
        status: 'CONFIRMED', // ยกเลิกได้เฉพาะที่ยังจองอยู่
      },
    });

    if (!reservation) {
      throw new Error('Reservation not found or already canceled');
    }

    const [updatedConcert, updatedReservation] = await this.prisma.$transaction(
      [
        this.prisma.concert.update({
          where: { id: concertId },
          data: { availableSeats: { increment: 1 } },
        }),
        this.prisma.reservation.update({
          where: { id: reservation.id },
          data: {
            status: 'CANCELED',
            canceledAt: new Date(),
          },
        }),
      ],
    );
    const concert = await this.prisma.concert.findUnique({
      where: { id: concertId },
    });

    await this.prisma.userActionLog.create({
      data: {
        userId,
        action: 'Cancel reservation',
        details: `Concert: ${concert ? concert.name : 'unknown'}`,
      },
    });

    return updatedReservation;
  }

  async history(userId: string) {
    return this.prisma.userActionLog.findMany({
      where: { userId },
    });
  }
}
