import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UUID } from 'crypto';

export class ResponseSectorDTO {
    @Expose()
    @ApiProperty({ example: 'e8c7a0b9-7a0c-4f1d-8a3e-5f3c1e6b3a1f', description: 'Sector ID' })
    id!: UUID;

    @Expose()
    @ApiProperty({ example: 'The last Sector', description: 'Sector Name' })
    name!: string;

    @ApiProperty({ description: 'Sector Created At' })
    @Expose()
    created_at?: Date;

    @ApiProperty({ description: 'Sector Updated At' })
    @Expose()
    updated_at?: Date;
}