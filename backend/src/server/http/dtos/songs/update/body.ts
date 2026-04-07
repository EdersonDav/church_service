import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateSongBody {
  @ApiProperty({ example: 'Te Louvarei', required: false })
  @IsOptional()
  @IsString()
  @Length(2, 120)
  title?: string;

  @ApiProperty({ example: 'F#m', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 10)
  default_key?: string;
}
