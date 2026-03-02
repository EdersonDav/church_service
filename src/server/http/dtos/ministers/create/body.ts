import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, Length } from 'class-validator';

export class CreateMinisterBody {
  @ApiProperty({ example: 'f61c1fb0-316c-4a7a-a3b0-1bd19d8da3da' })
  @IsUUID()
  user_id!: string;

  @ApiProperty({ example: 'Jane Doe', required: false })
  @IsOptional()
  @IsString()
  @Length(2, 120)
  name?: string;
}
