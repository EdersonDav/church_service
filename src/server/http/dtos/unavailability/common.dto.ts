import { Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UnavailabilityDto {
    @Expose()
    @ApiProperty({ example: 'd51c7c49-03f1-4243-9b27-77c7c3d3dfd5', description: 'Unavailability identifier' })
    id!: string;

    @Expose()
    @ApiProperty({ example: '2024-07-01T00:00:00.000Z', description: 'Date in ISO format' })
    @Transform(({ value }) => value instanceof Date ? value.toISOString() : value)
    date!: string;
}
