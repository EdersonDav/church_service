import { IsEmail, IsString, IsStrongPassword, Length } from "class-validator"

export class VerifyCodeBody {
    @IsString({message: 'The code is needed'})
    @Length(6, 6, {message: 'Invalid code'})
    code!: string

    @IsEmail({}, {
        message: "Email must be a valid email address."
    })
    @IsString({message: 'The email is needed'})
    email!: string
}