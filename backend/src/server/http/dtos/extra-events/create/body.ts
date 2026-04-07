import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsOptional, IsString, Length, MaxLength } from 'class-validator';

export class CreateExtraEventBody {
  @ApiProperty({ example: 'Conferência de Casais' })
  @IsString()
  @Length(3, 100)
  name!: string;

  @ApiProperty({ example: 'Evento anual da igreja', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({ example: 'COUPLE_SERVICE', required: false })
  @IsOptional()
  @IsString()
  @Length(3, 50)
  type?: string;

  @ApiProperty({ example: '2026-09-12T19:00:00.000Z' })
  @IsISO8601({}, { message: 'Invalid date format. Use ISO 8601.' })
  date!: string;
}
