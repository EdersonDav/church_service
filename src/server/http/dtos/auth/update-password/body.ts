import { IsEmail, IsString, IsStrongPassword, Length } from "class-validator"

export class UpdatePasswordBody {
    @IsEmail({}, {
        message: "Email must be a valid email address."
    })
    @IsString({ message: 'The email is needed' })
    email!: string

    @IsString({ message: 'The password is needed' })
    @Length(8, 100, { message: 'The password must be between 8 and 100 characters' })
    @IsStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }, {
        message: "Password must be strong and contain at least 8 characters, including at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol."
    })
    password!: string;

    @IsString({ message: 'The token is needed' })
    @Length(32, 32, { message: 'Invalid token' })
    token!: string;
}