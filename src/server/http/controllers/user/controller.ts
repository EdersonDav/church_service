import { Body, Controller, Post } from '@nestjs/common';
import { CreateUser } from '../../../../core/use-cases/user/create';
import { CreateVerificationCode } from '../../../../core/use-cases/verification-code/create';
import { CreateUserBody, CreateUserResponseData } from '../../dtos';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUser: CreateUser,
  ) { }

  @Post('')
  async create(
    @Body() body: CreateUserBody
  ): Promise<CreateUserResponseData> {
    const { data } = await this.createUser.execute(body);


    return {email: data.email, name: data.name} as CreateUserResponseData;
  }
}