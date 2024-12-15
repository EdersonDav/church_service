import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
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
  async login(@Body() { email: queryEmail, password }: LoginQuery): Promise<UserResponse> {
    const { user } = await this.validateUser.execute({ email: queryEmail, password });
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    const { email, name, role } = user
    const { access_token } = await this.createToken.execute({ email: user.email, name: user.name, role: user.role });
    return { data: { email, name, role } }
  }
}
