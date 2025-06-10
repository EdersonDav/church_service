import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ResponseUserDTO } from '../../common';

export class GetUserResponse {
    @ApiProperty({ description: 'Get User Data', type: ResponseUserDTO })
    @Expose()
    @Type(() => ResponseUserDTO)
    data!: ResponseUserDTO;
}