import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, Min } from 'class-validator';

export class CreateConcertDto {
  @ApiProperty({ example: 'BTS Live' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'K-pop concert' })
  @IsString()
  description!: string;

  @ApiProperty({ example: 100 })
  @IsInt()
  @Min(1)
  totalSeats!: number;

  @ApiProperty({ example: 100 })
  @IsInt()
  @Min(0)
  availableSeats!: number;
}
