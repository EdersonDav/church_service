import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UUID } from 'crypto';

export class ResponseUserDTO {
    @ApiProperty({ description: 'User ID' })
    @Expose()
    id!: UUID;

    @ApiProperty({ description: 'User Email' })
    @Expose()
    email!: string;

    @ApiProperty({ description: 'User Name' })
    @Expose()
    name!: string;

    @ApiProperty({ description: 'User Birthday' })
    @Expose()
    birthday?: Date | null;

    @ApiProperty({ description: 'User Is Verified' })
    @Expose()
    is_verified!: boolean

    @ApiProperty({ description: 'User Created At' })
    @Expose()
    created_at?: Date;

    @ApiProperty({ description: 'User Updated At' })
    @Expose()
    updated_at?: Date;

    @Exclude()
    password?: string;
}
