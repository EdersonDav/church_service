import { Body, Controller, Post, UnauthorizedException, Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateToken } from '../../../../core/use-cases/auth/create';
import { ValidateUser } from '../../../../core/use-cases/auth/validate';
import { LoginBody, LoginResponse } from '../../dtos';
import { CreateVerificationCode } from '../../../../core/use-cases/verification-code';

@Controller()
export class LoginController {
  constructor(
    private readonly createToken: CreateToken,
    private readonly validateUser: ValidateUser,
    private readonly createVerificationCode: CreateVerificationCode,
  ) { }

  @Post('login')
  async login(
    @Body() body: LoginBody,
    @Res() res: Response
  ): Promise<Response<LoginResponse>> {
    const { data } = await this.validateUser.execute({ email: body.email, password: body.password });
    if (!data) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const { email, name, is_verified } = data;
    if (!is_verified) {
      await this.createVerificationCode.execute({
        user: data,
      });
      return res.status(401).send({ message: 'Verify your email' });
    }

    const { access_token } = await this.createToken.execute({ email, name });

    res.setHeader('Authorization', `Bearer ${access_token}`);

    return res.status(200).send({ data: { email, name } });

  }
}