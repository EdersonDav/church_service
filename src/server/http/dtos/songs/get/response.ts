import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { SongDto } from '../common/song.dto';

export class GetSongResponse {
  @Expose()
  @Type(() => SongDto)
  @ApiProperty({ type: SongDto })
  song!: SongDto;
}
