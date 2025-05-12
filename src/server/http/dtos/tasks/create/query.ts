import { IsOptional, IsString, IsUrl, Length } from "class-validator"

export class CreateTaskBody {
    @IsString()
    @Length(3, 25, { message: 'The name must be between 3 and 25 characters' })
    name!: string

    @IsOptional()
    @IsString()
    @IsUrl()
    icon?: string

    @IsOptional()
    @IsString()
    description?: string
}