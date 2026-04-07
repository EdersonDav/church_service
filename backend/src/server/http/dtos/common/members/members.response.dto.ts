import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseChurchDTO, ResponseUserDTO } from '..';

export class ResponseMembersDTO {
    @Expose()
    @ApiProperty({ example: 'The church', description: 'Church' })
    @Type(() => ResponseChurchDTO)
    church!: ResponseChurchDTO;

    @Expose()
    @ApiProperty({ example: 'List of members', description: 'Members of the church' })
    @Type(() => ResponseUserDTO)
    members!: ResponseUserDTO[];
}