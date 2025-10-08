import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ScaleDto } from '../common/scale.dto';

export class GetScaleResponse {
    @Expose()
    @Type(() => ScaleDto)
    @ApiProperty({ type: ScaleDto, nullable: true })
    scale!: ScaleDto | null;
}
