import { IsISO8601, IsOptional } from 'class-validator';

export class UpdateScaleBody {
    @IsOptional()
    @IsISO8601({}, { message: 'Invalid date format. Use ISO 8601.' })
    date?: string;
}
