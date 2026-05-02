import { IsISO8601, IsString, Length } from 'class-validator';

export class CreateScaleBody {
    @IsString()
    @Length(3, 80, { message: 'The title must be between 3 and 80 characters' })
    title!: string;

    @IsISO8601({}, { message: 'Invalid date format. Use ISO 8601.' })
    date!: string;
}
