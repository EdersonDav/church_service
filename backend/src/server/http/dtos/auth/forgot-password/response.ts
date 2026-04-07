import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordResponseData {
    @ApiProperty({ description: 'Data forgot pass response' })
    @Expose()
    message!: string;
}