import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UserHistoryDto {
  @ApiProperty({ example: 'user-abc123' })
  @IsString()
  userId!: string;
}