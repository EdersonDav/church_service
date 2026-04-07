import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class CheckTokenQuery {
    @IsString({ message: 'The token is needed' })
    @IsNotEmpty({ message: 'The token is needed' })
    token!: string;

    @IsEmail({}, {
        message: "Email must be a valid email address."
    })
    @IsString({ message: 'The email is needed' })
    email!: string;
}