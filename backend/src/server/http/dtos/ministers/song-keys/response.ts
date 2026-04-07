import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { MinisterSongKeyDto } from '../common/minister-song-key.dto';

export class MySongKeysResponse {
  @Expose()
  @ApiProperty({ type: [MinisterSongKeyDto] })
  @Type(() => MinisterSongKeyDto)
  keys!: MinisterSongKeyDto[];
}
