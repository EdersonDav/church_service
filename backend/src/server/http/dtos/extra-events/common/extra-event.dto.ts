import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UUID } from 'crypto';

export class ExtraEventDto {
  @Expose()
  @ApiProperty({ example: '3bb7c05e-b63d-49cb-9b7f-3c7fdb7a4f6b' })
  id!: UUID;

  @Expose()
  @ApiProperty({ example: 'Conferência de Casais' })
  name!: string;

  @Expose()
  @ApiProperty({ example: 'Evento anual da igreja', required: false })
  description?: string;

  @Expose()
  @ApiProperty({ example: 'COUPLE_SERVICE', required: false })
  type?: string;

  @Expose()
  @ApiProperty({ example: '2026-09-12T19:00:00.000Z' })
  date!: Date;

  @Expose()
  @ApiProperty({ example: 'e8c7a0b9-7a0c-4f1d-8a3e-5f3c1e6b3a1f' })
  church_id!: UUID;

  @Expose()
  @ApiProperty()
  created_at?: Date;

  @Expose()
  @ApiProperty()
  updated_at?: Date;
}
