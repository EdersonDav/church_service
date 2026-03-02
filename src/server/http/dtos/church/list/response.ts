import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseChurchDTO } from '../../common';

export class ListChurchesResponse {
  @Expose()
  @ApiProperty({ description: 'Lista de igrejas', type: [ResponseChurchDTO] })
  @Type(() => ResponseChurchDTO)
  churches!: ResponseChurchDTO[];
}
