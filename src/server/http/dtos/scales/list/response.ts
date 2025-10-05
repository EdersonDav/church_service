import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ScaleDto } from '../common/scale.dto';

export class ListScalesResponse {
    @Expose()
    @Type(() => ScaleDto)
    @ApiProperty({ type: ScaleDto, isArray: true })
    scales!: ScaleDto[];
}
