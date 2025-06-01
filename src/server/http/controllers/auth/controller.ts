import { Body, Controller, Post, UnauthorizedException, Res, Get, Query } from '@nestjs/common';
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
// validate-reset-token
