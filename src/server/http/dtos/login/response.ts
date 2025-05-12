import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseData {
    @Expose()
    @ApiProperty({ example: 'octocat@123.com', description: 'User Email' })
    email!: string;

    @Expose()
    @ApiProperty({ example: 'octocat', description: 'User Name' })
    name!: string;
}

export class LoginResponse {
    @ApiProperty({ description: 'Data user and response' })
    @Expose()
    @Type(() => LoginResponseData)
    data!: LoginResponseData;
}