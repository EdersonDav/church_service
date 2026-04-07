import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordResponse {
    @ApiProperty({ description: 'Update password response' })
    @Expose()
    message!: string;
}