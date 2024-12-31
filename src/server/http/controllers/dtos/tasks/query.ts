import { IsOptional, IsString } from "class-validator"

export class TaskBody {
    @IsString()
    name!: string

    @IsOptional()
    @IsString()
    icon?: string

    @IsOptional()
    @IsString()
    description?: string
}