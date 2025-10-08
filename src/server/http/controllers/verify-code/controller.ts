import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { VerifyCodeBody, VerifyCodeResponse } from '../../dtos';

import { VerifyCode } from '../../../../core/use-cases/verification-code/verify';
import { DeleteCode } from '../../../../core/use-cases/verification-code/delete-code';
import { GetUser } from '../../../../core/use-cases/user/get';
import { MarkAsVerifiedUser } from '../../../../core/use-cases/user/mark-as-verify';

@ApiTags('Verificação de Código')
@Controller('verify-code/user')
export class VerificationCodeController {
  constructor(
    private readonly verifyCode: VerifyCode,
    private readonly deleteCode: DeleteCode,
    private readonly getUser: GetUser,
    private readonly markAsVerifiedUser: MarkAsVerifiedUser,
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
}