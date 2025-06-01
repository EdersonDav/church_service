import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserResponse {
    @ApiProperty({ description: 'Update user response message' })
    @Expose()
    message!: string;
}