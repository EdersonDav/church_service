import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { RoleEnum } from '../../../../enums';
import { IsEnum } from 'class-validator';

export class UserResponseData {
    @Expose()
    @ApiProperty({ example: 'octocat@123.com', description: 'User Email' })
    email!: string;

    @Expose()
    @ApiProperty({ example: 'octocat', description: 'User Name' })
    name!: string;

    @ApiProperty({ example: RoleEnum.VOLUNTARY, enum: RoleEnum, enumName: 'RoleEnum' })
    @Expose()
    @IsEnum(RoleEnum)
    role: RoleEnum = RoleEnum.VOLUNTARY;
}

export class UserResponse {
    @ApiProperty({ description: 'Data user and response' })
    @Expose()
    @Type(() => UserResponseData)
    data!: UserResponseData;
}