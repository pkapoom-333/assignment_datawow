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

  findAll() {
    return this.prisma.concert.findMany();
  }

  findOne(id: string) {
    return this.prisma.concert.findUnique({ where: { id } });
  }

  remove(id: string) {
    return this.prisma.concert.delete({ where: { id } });
  }
}
