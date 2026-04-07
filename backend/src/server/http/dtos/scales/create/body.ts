import { IsISO8601 } from 'class-validator';

export class CreateScaleBody {
    @IsISO8601({}, { message: 'Invalid date format. Use ISO 8601.' })
    date!: string;
}
