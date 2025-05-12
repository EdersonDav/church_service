import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserResponseData {
    @Expose()
    @ApiProperty({ example: 'octocat@123.com', description: 'Email' })
    email!: string;

    @Expose()
    @ApiProperty({ example: 'octocat', description: 'Name' })
    name!: string;
}

export class CreateUserResponse {
    @ApiProperty({ description: 'Data user and response' })
    @Expose()
    @Type(() => CreateUserResponseData)
    data!: CreateUserResponseData;
}