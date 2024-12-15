import { IsEmail, IsString } from "class-validator"

export class LoginQuery {
    @IsString()
    password!: string

    @IsEmail()
    email!: string
}