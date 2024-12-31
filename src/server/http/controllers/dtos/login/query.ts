import { IsEmail, IsString } from "class-validator"

export class LoginBody {
    @IsString()
    password!: string

    @IsEmail()
    email!: string
}