import { IsEmail, IsEnum, IsUUID } from "class-validator";
import { RoleEnum } from "../../../../enums";

export class Input {
    @IsUUID()
    name!: string

    @IsEmail()
    email!: string

    @IsEnum(RoleEnum)
    role!: RoleEnum
}