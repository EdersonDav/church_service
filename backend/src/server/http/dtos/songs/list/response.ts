import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { SongDto } from '../common/song.dto';

export class ListSongsResponse {
  @Expose()
  @Type(() => SongDto)
  @ApiProperty({ type: [SongDto] })
  songs!: SongDto[];
}
