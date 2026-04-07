import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class SongDto {
  @Expose()
  @ApiProperty({ example: 'f971f727-8861-4d37-b37f-9c48f6172e2f' })
  id!: string;

  @Expose()
  @ApiProperty({ example: 'Alvo Mais Que a Neve' })
  title!: string;

  @Expose()
  @ApiProperty({ example: 'G' })
  default_key!: string;

  @Expose()
  @ApiProperty({ example: 'e8c7a0b9-7a0c-4f1d-8a3e-5f3c1e6b3a1f' })
  church_id!: string;

  @Expose()
  @ApiProperty()
  created_at?: Date;

  @Expose()
  @ApiProperty()
  updated_at?: Date;
}
