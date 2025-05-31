import { IsNotEmpty, IsString } from "class-validator"

export class UpdatePasswordQuery {
    @IsString({ message: 'The token is needed' })
    @IsNotEmpty({ message: 'The token is needed' })
    token!: string;
}