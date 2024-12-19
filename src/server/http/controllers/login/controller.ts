import { Body, Controller, Post, UnauthorizedException, Res } from '@nestjs/common';
import { Response } from 'express';
import { CreateToken, ValidateUser } from '../../../../core/use-cases/auth';
import { LoginQuery } from '../dtos/login/query';
import { UserResponse } from '../dtos/login/response';

@Controller()
export class LoginController {
  constructor(
    private readonly createToken: CreateToken,
    private readonly validateUser: ValidateUser
  ) { }

  @Post('login')
  async login(
    @Body() { email: queryEmail, password }: LoginQuery,
    @Res() res: Response
  ): Promise<Response<UserResponse>> {
    const { user } = await this.validateUser.execute({ email: queryEmail, password });
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const { email, name, role } = user;
    const { access_token } = await this.createToken.execute({ email, name, role });

    // Adicionando o token ao header
    res.setHeader('Authorization', `Bearer ${access_token}`);

    // Enviando a resposta com os dados do usuário
    return res.status(200).send({ data: { email, name, role } });

  }
}