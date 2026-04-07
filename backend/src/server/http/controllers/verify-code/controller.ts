import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  ResendVerifyCodeBody,
  ResendVerifyCodeResponse,
  VerifyCodeBody,
  VerifyCodeResponse,
} from '../../dtos';

import { CreateVerificationCode, VerifyCode } from '../../../../core/use-cases/verification-code';
import { DeleteCode } from '../../../../core/use-cases/verification-code/delete-code';
import { GetUser } from '../../../../core/use-cases/user/get';
import { MarkAsVerifiedUser } from '../../../../core/use-cases/user/mark-as-verify';
import { SendVerifyCode } from '../../../../core/use-cases/emails';

@ApiTags('Verificação de Código')
@Controller('verify-code/user')
export class VerificationCodeController {
  constructor(
    private readonly createVerificationCode: CreateVerificationCode,
    private readonly verifyCode: VerifyCode,
    private readonly deleteCode: DeleteCode,
    private readonly getUser: GetUser,
    private readonly markAsVerifiedUser: MarkAsVerifiedUser,
    private readonly sendVerifyCode: SendVerifyCode,
  ) { }

  @Post('')
  @ApiOperation({ summary: 'Validar código de verificação enviado por e-mail' })
  @ApiBody({
    type: VerifyCodeBody,
    description: 'Código recebido por e-mail e e-mail do usuário',
    examples: {
      default: {
        summary: 'Validação de código',
        value: {
          email: 'maria.souza@example.com',
          code: '123456',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Resultado da validação do código',
    schema: {
      example: {
        data: {
          message: 'User verified successfully',
        },
      },
    },
  })
  async create(
    @Body() {code, email}: VerifyCodeBody
  ): Promise<VerifyCodeResponse> {
    let message = 'Invalid code or email';
    const user = await this.getUser.execute({search_by: 'email', search_data: email });
    if (!user.data?.id) {
      return {
        data: { message } 
      }
    }
    const verificationCode = await this.verifyCode.execute({ code, user_id: user.data?.id });
    if (!verificationCode.data) {
      return {
        data: { message }
      }
    }
    
    await Promise.all([
      this.markAsVerifiedUser.execute({ user_id: user.data?.id }),
      this.deleteCode.execute({ user_id: user.data?.id })
    ]);
    
    return {
      data: { message: 'User verified successfully' }
    }
  }

  @Post('resend')
  @ApiOperation({ summary: 'Reenviar cÃ³digo de verificaÃ§Ã£o por e-mail' })
  @ApiBody({
    type: ResendVerifyCodeBody,
    description: 'E-mail do usuÃ¡rio que precisa receber um novo cÃ³digo',
    examples: {
      default: {
        summary: 'Reenvio de cÃ³digo',
        value: {
          email: 'maria.souza@example.com',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Resultado do reenvio do cÃ³digo',
    schema: {
      example: {
        data: {
          message: 'Verification code resent successfully',
        },
      },
    },
  })
  async resend(
    @Body() { email }: ResendVerifyCodeBody,
  ): Promise<ResendVerifyCodeResponse> {
    const user = await this.getUser.execute({ search_by: 'email', search_data: email });

    if (!user.data?.id || !user.data?.email || user.data.is_verified) {
      return {
        data: { message: 'Invalid email' },
      };
    }

    await this.deleteCode.execute({ user_id: user.data.id });
    const { data } = await this.createVerificationCode.execute({
      user: user.data,
    });

    await this.sendVerifyCode.execute({
      email: user.data.email,
      code: data.code,
    });

    return {
      data: { message: 'Verification code resent successfully' },
    };
  }
}
