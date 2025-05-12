import { IsString, Length } from "class-validator";

export class CreateChurchBody {
    @IsString({message: 'The name is needed'})
    @Length(3, 25, {message: 'The name must be between 3 and 25 characters'})
    name!: string
}