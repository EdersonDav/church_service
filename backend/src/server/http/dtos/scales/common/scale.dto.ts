import { Expose, Type, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ScaleParticipantDto } from './participant.dto';

export class ScaleDto {
    @Expose()
    @ApiProperty({ example: '0e91d1cd-a808-4ef3-9618-1f049d9fe76d', description: 'Scale identifier' })
    id!: string;

    @Expose()
    @ApiProperty({ example: '2024-06-21T18:00:00.000Z', description: 'Scheduled date in ISO format' })
    @Transform(({ value }) => value instanceof Date ? value.toISOString() : value)
    date!: string;

    @Expose()
    @ApiProperty({ example: '5a971fe8-d468-44df-a582-4adb44d6fda0', description: 'Sector identifier' })
    sector_id!: string;

    @Expose()
    @Type(() => ScaleParticipantDto)
    @ApiProperty({ type: ScaleParticipantDto, isArray: true })
    participants!: ScaleParticipantDto[];
}
