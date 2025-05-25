import { IsString, Length } from "class-validator"

export class CheckTokenQuery {
    @IsString({ message: 'The token is needed' })
    @Length(32, 32, { message: 'Invalid token' })
    token!: string;
}