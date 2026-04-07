import { IsEmail, IsString, Length } from "class-validator"

export class GetUserParam {
    @IsEmail({}, {
        message: "Email must be a valid email address."
    })
    @IsString({message: 'The email is needed'})
    @Length(3, 100, {message: 'The email must be between 3 and 100 characters'})
    email!: string
}