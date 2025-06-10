import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UUID } from 'crypto';
import { ChurchDTO, UserDTO } from '../../common';
import { RoleEnum } from '../../../../../enums';

export class GetChurchUserResponse {
    @ApiProperty({ description: 'Unique identifier for the church user' })
    @Expose()
    id!: UUID;

    @ApiProperty({ description: 'Timestamp when the church user was created' })
    @Expose()
    created_at?: Date;

    @ApiProperty({ description: 'Timestamp when the church user was last updated' })
    @Expose()
    updated_at?: Date;

    @ApiProperty({ description: 'Role of the user in the church' })
    @Expose()
    role!: RoleEnum;

    @ApiProperty({ description: 'Unique identifier for the user' })
    @Expose()
    user_id!: UUID;

    @ApiProperty({ description: 'Unique identifier for the church' })
    @Expose()
    church_id!: UUID;

    @ApiProperty({ description: 'User information' })
    @Expose()
    @Type(() => UserDTO)
    user!: UserDTO;

    @ApiProperty({ description: 'Church information' })
    @Expose()
    @Type(() => ChurchDTO)
    church!: ChurchDTO;

}