import { Body, Controller, Post, UnauthorizedException, Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateToken } from '../../../../core/use-cases/auth/create';
import { ValidateUser } from '../../../../core/use-cases/auth/validate';
import { LoginBody } from '../dtos/login/query';
import { UserResponse } from '../dtos/login/response';

@Controller()
export class LoginController {
  constructor(
    private readonly createToken: CreateToken,
    private readonly validateUser: ValidateUser
  ) { }

  @Post('login')
  async login(
    @Body() body: LoginBody,
    @Res() res: Response
  ): Promise<Response<UserResponse>> {
    const { data } = await this.validateUser.execute({ email: body.email, password: body.password });
    if (!data) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const { email, name, role } = data;
    const { access_token } = await this.createToken.execute({ email, name, role });

    res.setHeader('Authorization', `Bearer ${access_token}`);

    return res.status(200).send({ data: { email, name, role } });

  }
}