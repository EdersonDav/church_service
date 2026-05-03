import { IsISO8601, IsOptional } from 'class-validator';

export class CreateUnavailabilityBody {
    @IsISO8601({}, { message: 'Invalid date format. Use ISO 8601.' })
    date!: string;

    @IsOptional()
    @IsISO8601({}, { message: 'Invalid end date format. Use ISO 8601.' })
    end_date?: string;
}
