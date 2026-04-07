import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ScaleSongDto {
  @Expose()
  @ApiProperty({ example: '4ceb96d4-bf23-4d11-a34e-f314158b9fd5' })
  id!: string;

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
  key!: string;

  @Expose()
  @ApiProperty({ example: '6d377d4a-1665-4f0f-a021-f655a0e050af', nullable: true })
  minister_id?: string | null;

  @Expose()
  @ApiProperty({ example: 'Jane Doe', nullable: true })
  minister_name?: string | null;
}
