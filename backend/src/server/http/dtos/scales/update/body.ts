import { IsEnum, IsISO8601, IsOptional, IsString, Length, MaxLength } from 'class-validator';
import { ScaleStatusEnum } from '../../../../../enums';

export class UpdateScaleBody {
    @IsOptional()
    @IsString()
    @Length(3, 80, { message: 'The title must be between 3 and 80 characters' })
    title?: string;

    @IsOptional()
    @IsString()
    @MaxLength(2000, { message: 'The description must be at most 2000 characters long' })
    description?: string;

    @IsOptional()
    @IsEnum(ScaleStatusEnum, { message: 'Invalid scale status' })
    status?: ScaleStatusEnum;

    @IsOptional()
    @IsISO8601({}, { message: 'Invalid date format. Use ISO 8601.' })
    date?: string;
}
