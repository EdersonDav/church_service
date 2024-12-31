import { IsEmail, IsEnum, IsString } from "class-validator";
import { RoleEnum } from "../../../../enums";

export class Input {
    @IsString()
    name!: string

    @IsEmail()
    email!: string

    @IsEnum(RoleEnum)
    role!: RoleEnum
}