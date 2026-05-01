import { Body, Controller, Post, UnauthorizedException, Res, Get, Query, Logger, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthGuard } from '../../../../core/guards';
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
  private readonly logger = new Logger(LoginController.name);

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

  private sanitizeBody(body: object) {
    const hiddenFields = ['password', 'token'];

    return Object.entries(body).reduce<Record<string, unknown>>((acc, [key, value]) => {
      acc[key] = hiddenFields.includes(key.toLowerCase()) ? '[hidden]' : value;
      return acc;
    }, {});
  }

  private logRequestResponse(
    req: Request,
    body: object,
    data: unknown,
    level: 'log' | 'warn' = 'log',
  ) {
    this.logger[level]({
      url: req.originalUrl || req.url,
      body: this.sanitizeBody(body),
      response: {
        data,
      },
    });
  }

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
    @Res() res: Response,
    @Req() req: Request
  ): Promise<Response<LoginResponse>> {
    const { data: user } = await this.validateUser.execute({ email: body.email, password: body.password });
    if (!user) {
      this.logRequestResponse(req, body, null, 'warn');
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const { email, name, is_verified } = user;
    if (!is_verified) {
      await this.createVerificationCode.execute({
        user,
      });
      this.logRequestResponse(req, body, null, 'warn');
      return res.status(401).send({ message: 'Verify your email' });
    }

    const { data: { access_token } } = await this.createToken.execute({ id: user.id });

    res.setHeader('Authorization', `Bearer ${access_token}`);

    const data = { email, name };
    this.logRequestResponse(req, body, data);

    return res.status(200).send({ data });

  }

  @Post('logout')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Registrar saída do usuário autenticado' })
  @ApiOkResponse({
    description: 'Saída registrada com sucesso',
    schema: {
      example: {
        data: {
          message: 'Logout registered',
        },
      },
    },
  })
  async logout(
    @Req() req: Request,
    @Body() body: Record<string, unknown>,
  ): Promise<{ data: { message: string } }> {
    const data = { message: 'Logout registered' };

    this.logRequestResponse(req, body ?? {}, data);

    return { data };
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
