import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UnavailabilityDto } from './common.dto';

export class ListUnavailabilityResponse {
    @Expose()
    @Type(() => UnavailabilityDto)
    @ApiProperty({ type: UnavailabilityDto, isArray: true })
    items!: UnavailabilityDto[];
}
