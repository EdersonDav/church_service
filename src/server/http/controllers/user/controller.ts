import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { CreateUser } from '../../../../core/use-cases/user/create';
import { DeleteUser } from '../../../../core/use-cases/user/delete';
import { CreateVerificationCode } from '../../../../core/use-cases/verification-code/create';
import { CreateUserBody, CreateUserResponse } from '../../dtos';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUser: CreateUser,
    private readonly createVerificationCode: CreateVerificationCode,
    private readonly deleteUser: DeleteUser,
  ) { }

  @Post('')
  async create(
    @Body() body: CreateUserBody
  ): Promise<CreateUserResponse> {
    const { data } = await this.createUser.execute(body);
    if (!data || !data.email) {
      throw new Error('Error during user creation');
    }

    if (data.is_verified) {
      return { message: 'User created' };
    }
    
    try {
      await this.createVerificationCode.execute({
        user: data,
      });
      return {message: 'Verify your email'};
    }catch (error) {
      console.log(error);
      await this.delete(data.email);
      throw new Error('Error sending verification code');
    }
  }

  @Delete(':email')
  async delete(
    @Param() email: string
  ): Promise<void> {
    await this.deleteUser.execute({ email });
    return;
  }
}