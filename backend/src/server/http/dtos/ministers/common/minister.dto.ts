import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class MinisterDto {
  @Expose()
  @ApiProperty({ example: '6d377d4a-1665-4f0f-a021-f655a0e050af' })
  id!: string;

  @Expose()
  @ApiProperty({ example: 'e8c7a0b9-7a0c-4f1d-8a3e-5f3c1e6b3a1f' })
  church_id!: string;

  @Expose()
  @ApiProperty({ example: 'f61c1fb0-316c-4a7a-a3b0-1bd19d8da3da' })
  user_id!: string;

  @Expose()
  @ApiProperty({ example: 'Jane Doe' })
  name!: string;

  @Expose()
  @ApiProperty({ example: 'Jane Doe', required: false })
  user_name?: string;

  @Expose()
  @ApiProperty()
  created_at?: Date;

  @Expose()
  @ApiProperty()
  updated_at?: Date;
}
