import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ExtraEventDto } from '../common/extra-event.dto';

export class GetExtraEventResponse {
  @Expose()
  @ApiProperty({ type: ExtraEventDto })
  @Type(() => ExtraEventDto)
  event!: ExtraEventDto;
}
