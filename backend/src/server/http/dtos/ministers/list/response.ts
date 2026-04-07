import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { MinisterDto } from '../common/minister.dto';

export class ListMinistersResponse {
  @Expose()
  @Type(() => MinisterDto)
  @ApiProperty({ type: [MinisterDto] })
  ministers!: MinisterDto[];
}
