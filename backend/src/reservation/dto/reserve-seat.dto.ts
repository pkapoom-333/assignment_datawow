import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class ReserveSeatDto {
  @ApiProperty({ example: 'user-abc123' })
  @IsString()
  userId!: string;

  @ApiProperty({ example: 'concert-xyz456' })
  @IsUUID()
  concertId!: string;
}
