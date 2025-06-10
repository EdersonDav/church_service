import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserDTO } from '../../common/';

export class GetUserResponse {
    @ApiProperty({ description: 'Get User Data', type: UserDTO })
    @Expose()
    @Type(() => UserDTO)
    data!: UserDTO;
}