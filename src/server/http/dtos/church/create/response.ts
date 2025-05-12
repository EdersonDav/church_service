import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UUID } from 'crypto';

export class CreateChurchResponseData {
    @Expose()
    @ApiProperty({ example: 'e8c7a0b9-7a0c-4f1d-8a3e-5f3c1e6b3a1f', description: 'Church ID' })
    id!: UUID;

    @Expose()
    @ApiProperty({ example: 'The last church', description: 'Church Name' })
    name!: string;
}