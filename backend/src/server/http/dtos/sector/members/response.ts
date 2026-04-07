import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseSectorDTO, ResponseUserDTO } from '../../common';

export class ResponseSectorMembersDTO {
  @Expose()
  @ApiProperty({ description: 'Informações do setor' })
  @Type(() => ResponseSectorDTO)
  sector!: ResponseSectorDTO;

  @Expose()
  @ApiProperty({ description: 'Membros vinculados ao setor', type: [ResponseUserDTO] })
  @Type(() => ResponseUserDTO)
  members!: ResponseUserDTO[];
}
