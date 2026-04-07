import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyCodeResponse {
    @ApiProperty({ description: 'Verify code response message' })
    @Expose()
    data!: {message: string};
}