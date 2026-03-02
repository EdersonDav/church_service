import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateSongBody {
  @ApiProperty({ example: 'Alvo Mais Que a Neve' })
  @IsString()
  @Length(2, 120)
  title!: string;

  @ApiProperty({ example: 'G' })
  @IsString()
  @Length(1, 10)
  default_key!: string;
}
