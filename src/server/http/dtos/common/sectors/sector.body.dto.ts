import { IsString, Length, IsOptional, MaxLength } from "class-validator";

export class BodySectorDTO {
    @IsString({ message: 'The name is needed' })
    @Length(3, 50, { message: 'The name must be between 3 and 50 characters' })
    name!: string;
}