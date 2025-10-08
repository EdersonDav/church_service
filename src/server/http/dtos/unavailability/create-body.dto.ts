import { IsISO8601 } from 'class-validator';

export class CreateUnavailabilityBody {
    @IsISO8601({}, { message: 'Invalid date format. Use ISO 8601.' })
    date!: string;
}
