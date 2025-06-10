import { IsString, Length, IsOptional, MaxLength } from "class-validator";

export class BodyChurchDTO {
    @IsString({ message: 'The name is needed' })
    @Length(3, 25, { message: 'The name must be between 3 and 25 characters' })
    name!: string;

    @IsOptional()
    @MaxLength(100, { message: 'The description must be at most 100 characters long' })
    description?: string;
}