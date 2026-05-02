import { IsISO8601, IsOptional, IsString, Length } from 'class-validator';

export class UpdateScaleBody {
    @IsOptional()
    @IsString()
    @Length(3, 80, { message: 'The title must be between 3 and 80 characters' })
    title?: string;

    @IsOptional()
    @IsISO8601({}, { message: 'Invalid date format. Use ISO 8601.' })
    date?: string;
}
