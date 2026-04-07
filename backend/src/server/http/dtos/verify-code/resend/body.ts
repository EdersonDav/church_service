import { IsEmail, IsString } from 'class-validator';

export class ResendVerifyCodeBody {
  @IsEmail(
    {},
    {
      message: 'Email must be a valid email address.',
    },
  )
  @IsString({ message: 'The email is needed' })
  email!: string;
}
