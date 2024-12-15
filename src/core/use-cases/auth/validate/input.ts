import { IsString, IsEmail, IsUUID } from "class-validator";

export class Input {
    @IsEmail()
    email!: string

    @IsString()
    password!: string;
}