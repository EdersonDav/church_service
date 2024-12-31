import { IsOptional, IsString } from "class-validator";

export class Input {
    @IsString()
    name!: string

    @IsOptional()
    @IsString()
    icon?: string

    @IsOptional()
    @IsString()
    description?: string
}