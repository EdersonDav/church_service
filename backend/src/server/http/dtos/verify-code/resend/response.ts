import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ResendVerifyCodeResponse {
  @ApiProperty({ description: 'Resend verify code response message' })
  @Expose()
  data!: { message: string };
}
