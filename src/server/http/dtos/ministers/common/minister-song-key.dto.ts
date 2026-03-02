import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class MinisterSongKeyDto {
  @Expose()
  @ApiProperty({ example: 'f971f727-8861-4d37-b37f-9c48f6172e2f' })
  song_id!: string;

  @Expose()
  @ApiProperty({ example: 'Alvo Mais Que a Neve' })
  song_title!: string;

  @Expose()
  @ApiProperty({ example: 'G' })
  song_default_key!: string;

  @Expose()
  @ApiProperty({ example: 'A' })
  custom_key!: string;
}
