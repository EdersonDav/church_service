import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UUID } from 'crypto';
import { ResponseUserDTO, ResponseSectorDTO } from '../../common';
import { SectorRoleEnum } from '../../../../../enums';

export class GetSectorUserResponse {
    @ApiProperty({ description: 'Unique identifier for the sector user' })
    @Expose()
    id!: UUID;

    @ApiProperty({ description: 'Timestamp when the sector user was created' })
    @Expose()
    created_at?: Date;

    @ApiProperty({ description: 'Timestamp when the sector user was last updated' })
    @Expose()
    updated_at?: Date;

    @ApiProperty({ description: 'Role of the user in the sector' })
    @Expose()
    role!: SectorRoleEnum;

    @ApiProperty({ description: 'Unique identifier for the user' })
    @Expose()
    user_id!: UUID;

    @ApiProperty({ description: 'Unique identifier for the sector' })
    @Expose()
    sector_id!: UUID;

    @ApiProperty({ description: 'User information' })
    @Expose()
    @Type(() => ResponseUserDTO)
    user!: ResponseUserDTO;

    @ApiProperty({ description: 'Sector information' })
    @Expose()
    @Type(() => ResponseSectorDTO)
    sector!: ResponseSectorDTO;

}