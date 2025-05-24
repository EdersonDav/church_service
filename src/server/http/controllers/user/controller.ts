import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateUser } from '../../../../core/use-cases/user/create';
import { DeleteUser } from '../../../../core/use-cases/user/delete';
import { GetUser } from '../../../../core/use-cases/user/get';
import { CreateVerificationCode } from '../../../../core/use-cases/verification-code/create';
import { SendUserAlreadyExists, SendVerifyCode } from '../../../../core/use-cases/emails';
import { CreateUserBody, CreateUserResponse, GetUserParam, GetUserResponse, UserData } from '../../dtos';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUser: CreateUser,
    private readonly getUser: GetUser,
    private readonly createVerificationCode: CreateVerificationCode,
    private readonly deleteUser: DeleteUser,
    private readonly sendUserAlreadyExists: SendUserAlreadyExists,
    private readonly sendVerifyCode: SendVerifyCode
  ) { }

  @Get(':email')
  async get(
    @Param('email') email: GetUserParam['email']
  ): Promise<GetUserResponse | null> {
    const user = await this.getUser.execute({ search_by: 'email', search_data: email });
    if (!user?.data?.id) {
      return null;
    }
    
    return { data: user.data as UserData};
  }

  @Post('')
  async create(
    @Body() body: CreateUserBody
  ): Promise<CreateUserResponse> {
    const {data: existingUser} = await this.getUser.execute({ search_by: 'email', search_data: body.email });
    if (existingUser?.id && existingUser.is_verified) {
      this.sendUserAlreadyExists.execute({
        email: body.email
      });
      return { message: 'Verify your email'};
    }

    const { data: userCreated } = await this.createUser.execute(body);
    if (!userCreated || !userCreated.email) {
      throw new Error('Error during user creation');
    }

    if (userCreated.is_verified) {
      return { message: 'User created' };
    }
    
    try {
      const {data: {code}} = await this.createVerificationCode.execute({
        user: userCreated,
      });
      if (!code) {
        throw new Error('Error creating verification code');
      }
      this.sendVerifyCode.execute({
        email: userCreated.email,
        code
      });
      return {message: 'Verify your email'};
    }catch (error) {
      console.log(error);
      await this.delete(userCreated.email);
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