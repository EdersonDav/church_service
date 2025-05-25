import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CheckTokenResponseData {
    @ApiProperty({ description: 'Data token checked and response' })
    @Expose()
    message!: string;
}