import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ScaleSongDto } from '../common/scale-song.dto';

export class ListScaleSongsResponse {
  @Expose()
  @Type(() => ScaleSongDto)
  @ApiProperty({ type: [ScaleSongDto] })
  songs!: ScaleSongDto[];
}
