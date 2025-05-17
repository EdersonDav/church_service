import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserResponse {
    @ApiProperty({ description: 'Create user response message' })
    @Expose()
    message!: string;
}