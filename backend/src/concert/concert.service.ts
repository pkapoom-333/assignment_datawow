import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateConcertDto } from './dto/create-concert.dto';

@Injectable()
export class ConcertService {
  constructor(private prisma: PrismaService) {}

  create(data: CreateConcertDto) {
    const newData = {
      name: data.name,
      description: data.description,
      totalSeats: data.totalSeats,
      availableSeats: data.availableSeats,
    };

    return this.prisma.concert.create({ data: newData });
  }

  async findAll() {
    const listConcert = await this.prisma.concert.findMany();
    const listReservation = await this.prisma.reservation.findMany();

    const listConcertWithStats = listConcert.map((concert: any) => {
      const reservation = listReservation.filter(
        (reservation: any) => reservation.concertId === concert.id,
      );
      return {
        ...concert,
        listReservation: reservation,
      };
    });

    return listConcertWithStats;
  }

  findOne(id: string) {
    return this.prisma.concert.findUnique({ where: { id } });
  }

  remove(id: string) {
    return this.prisma.concert.delete({ where: { id } });
  }

  async getConcertStats() {
    const reservation = await this.prisma.reservation.findMany();
    const reservationConfirmed = reservation.filter(
      (reservation: any) => reservation.status === 'CONFIRMED',
    );
    const reservationCanceled = reservation.filter(
      (reservation: any) => reservation.status === 'CANCELED',
    );

    const totalSeats = await this.prisma.concert.findMany({
      select: {
        totalSeats: true,
      },
    });

    return {
      totalSeats: totalSeats.reduce(
        (acc: number, curr: any) => acc + curr.totalSeats,
        0,
      ),
      reservedSeats: reservationConfirmed.length,
      canceledSeats: reservationCanceled.length,
    };
  }
}
