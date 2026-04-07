import { Body, Controller, Post, UnauthorizedException, Res, Get, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { CreateToken } from '../../../../core/use-cases/auth/create';
import { ValidateUser } from '../../../../core/use-cases/auth/validate';
import { CreatePasswordResetToken, VerifyToken } from "../../../../core/use-cases/password-reset-token";
import { CreateVerificationCode } from '../../../../core/use-cases/verification-code';
import { GetUser, UpdatePasswordUser } from '../../../../core/use-cases/user';
import { SendResetPasswordToken } from '../../../../core/use-cases/emails'
import {
  LoginBody,
  LoginResponse,
  ForgotPassBody,
  ForgotPasswordResponseData,
  CheckTokenQuery,
  CheckTokenResponseData,
  UpdatePasswordBody,
  UpdatePasswordResponse,
  UpdatePasswordQuery
} from '../../dtos';

@ApiTags('Autenticação')
@Controller('auth')
export class LoginController {
  constructor(
    private readonly createToken: CreateToken,
    private readonly validateUser: ValidateUser,
    private readonly createVerificationCode: CreateVerificationCode,
    private readonly createPasswordResetToken: CreatePasswordResetToken,
    private readonly verifyToken: VerifyToken,
    private readonly getUser: GetUser,
    private readonly sendResetPasswordToken: SendResetPasswordToken,
    private readonly updatePasswordUser: UpdatePasswordUser
  ) { }

  @Post('login')
  @ApiOperation({ summary: 'Autenticar usuário e gerar token JWT' })
  @ApiBody({
    type: LoginBody,
    description: 'Credenciais do usuário',
    examples: {
      default: {
        summary: 'Login com e-mail e senha',
        value: {
          email: 'maria.souza@example.com',
          password: 'Strong#Password1',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Usuário autenticado com sucesso',
    schema: {
      example: {
        data: {
          email: 'maria.souza@example.com',
          name: 'Maria Souza',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Credenciais inválidas ou e-mail não verificado',
    schema: {
      example: {
        message: 'Verify your email',
      },
    },
  })
  async login(
    @Body() body: LoginBody,
    @Res() res: Response
  ): Promise<Response<LoginResponse>> {
    const { data: user } = await this.validateUser.execute({ email: body.email, password: body.password });
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const { email, name, is_verified } = user;
    if (!is_verified) {
      await this.createVerificationCode.execute({
        user,
      });
      return res.status(401).send({ message: 'Verify your email' });
    }

    const { data: { access_token } } = await this.createToken.execute({ id: user.id });

    res.setHeader('Authorization', `Bearer ${access_token}`);

    return res.status(200).send({ data: { email, name } });

  }

  @Get('validate-reset-token')
  @ApiOperation({ summary: 'Validar token de recuperação de senha' })
  @ApiQuery({ name: 'token', description: 'Token de recuperação recebido por e-mail', type: String })
  @ApiQuery({ name: 'email', description: 'E-mail associado ao token', type: String })
  @ApiOkResponse({
    description: 'Token válido',
    schema: {
      example: {
        message: 'ok',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Token inválido ou expirado',
    schema: {
      example: {
        message: 'Token expired',
      },
    },
  })
  async getValidateResetToken(
    @Query() query: CheckTokenQuery,
    @Res() res: Response
  ): Promise<Response<CheckTokenResponseData>> {
    const { token, email } = query;
    const { data: user } = await this.getUser.execute({ search_by: 'email', search_data: email });
    if (!user?.id || !user.email) {
      return res.status(400).send({ message: "Token expired" });
    }

    const { data: isValid } = await this.verifyToken.execute({ token, user_id: user.id });
    if (!isValid) {
      return res.status(400).send({ message: "Token expired" });
    }
    return res.status(200).send({ message: "ok" });
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Gerar e enviar token de redefinição de senha' })
  @ApiBody({
    type: ForgotPassBody,
    description: 'E-mail para envio do token de recuperação',
    examples: {
      default: {
        summary: 'Solicitação de redefinição',
        value: {
          email: 'maria.souza@example.com',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Solicitação processada com sucesso',
    schema: {
      example: {
        message: 'Verify your email',
      },
    },
  })
  async forgotPass(
    @Body() { email }: ForgotPassBody
  ): Promise<ForgotPasswordResponseData> {
    try {
      const { data: user } = await this.getUser.execute({ search_by: 'email', search_data: email });
      if (!user?.id || !user.email) {
        throw new Error();
      }
      const { data: { token } } = await this.createPasswordResetToken.execute({ user });

      if (!token) {
        throw new Error();
      }

      this.sendResetPasswordToken.execute({
        email: user.email,
        token
      });

      return { message: 'Verify your email' };
    } catch (error) {
      console.log(error);
      throw new Error('Error creating token');
    }
  }

  @Post('update-password')
  @ApiOperation({ summary: 'Atualizar senha utilizando token de recuperação' })
  @ApiQuery({ name: 'token', description: 'Token de recuperação válido', type: String })
  @ApiBody({
    type: UpdatePasswordBody,
    description: 'Dados para redefinição de senha',
    examples: {
      default: {
        summary: 'Redefinição de senha',
        value: {
          email: 'maria.souza@example.com',
          password: 'NewStrong#Password2',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Resultado da atualização de senha',
    schema: {
      example: {
        message: 'Password updated',
      },
    },
  })
  async updatePass(
    @Query() { token }: UpdatePasswordQuery,
    @Body() { email, password }: UpdatePasswordBody,
  ): Promise<UpdatePasswordResponse> {
    try {
      const { data: user } = await this.getUser.execute({ search_by: 'email', search_data: email });
      if (!user?.id || !user.email) {
        throw new Error('Error during validation token');
      }
      const { data: isValid } = await this.verifyToken.execute({ token, user_id: user.id });
      if (!isValid) {
        return { message: "Token expired" };
      }

      const passUpdated = await this.updatePasswordUser.execute({ email, password });

      if (!passUpdated) {
        throw new Error('Error during validation token');
      }
      return { message: 'Password updated' }
    } catch (error: any) {
      return { message: error.message }
    }
  }
}
