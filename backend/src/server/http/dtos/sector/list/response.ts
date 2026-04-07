import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseSectorDTO } from '../../common';

export class ListSectorsResponse {
    @Expose()
    @ApiProperty({ description: 'Lista de setores da igreja', type: [ResponseSectorDTO] })
    @Type(() => ResponseSectorDTO)
    sectors!: ResponseSectorDTO[];
}
