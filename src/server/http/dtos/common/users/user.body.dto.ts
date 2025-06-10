import { Transform } from "class-transformer";
import { IsDate, IsEmail, IsOptional, IsString, IsStrongPassword, Length } from "class-validator"

export class BodyUserDTO {
    @IsString({ message: 'The name is needed' })
    @Length(3, 25, { message: 'The name must be between 3 and 25 characters' })
    name!: string

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
    password!: string

    @IsEmail({}, {
        message: "Email must be a valid email address."
    })
    @IsString({ message: 'The email is needed' })
    @Length(3, 100, { message: 'The email must be between 3 and 100 characters' })
    email!: string;

    @IsOptional()
    @Transform(({ value }) => value ? new Date(value) : null)
    @IsDate({ message: 'The birthday is needed to format as YYYY-MM-DD' })
    birthday?: Date | null;
}