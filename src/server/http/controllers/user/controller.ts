import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  UseGuards
} from '@nestjs/common';
import { CreateVerificationCode } from '../../../../core/use-cases/verification-code/create';
import { SendUserAlreadyExists, SendVerifyCode } from '../../../../core/use-cases/emails';
import {
  CreateUserBody,
  CreateUserResponse,
  GetUserParam,
  GetUserResponse,
  ResponseUserDTO,
  UpdateUserBody
} from '../../dtos';
import {
  CreateUser,
  GetUser,
  DeleteUser,
  UpdateUser
} from '../../../../core/use-cases/user';
import { AuthGuard } from '../../../../core/guards/auth.guard';
import { ReqUserDecorator } from '../../../../common';
import { UUID } from 'crypto';

@Controller('users')
export class UserController {
  constructor(
    private readonly createUser: CreateUser,
    private readonly getUser: GetUser,
    private readonly updateUser: UpdateUser,
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

    return { data: user.data as ResponseUserDTO };
  }

  @Post('')
  async create(
    @Body() body: CreateUserBody
  ): Promise<CreateUserResponse> {
    const { data: existingUser } = await this.getUser.execute({ search_by: 'email', search_data: body.email });
    if (existingUser?.id && existingUser.is_verified) {
      this.sendUserAlreadyExists.execute({
        email: body.email
      });
      return { message: 'Verify your email' };
    }

    const { data: userCreated } = await this.createUser.execute(body);
    if (!userCreated || !userCreated.email) {
      throw new Error('Error during user creation');
    }

    if (userCreated.is_verified) {
      return { message: 'User created' };
    }

    try {
      const { data: { code } } = await this.createVerificationCode.execute({
        user: userCreated,
      });
      if (!code) {
        throw new Error('Error creating verification code');
      }
      this.sendVerifyCode.execute({
        email: userCreated.email,
        code
      });
      return { message: 'Verify your email' };
    } catch (error) {
      console.log(error);
      await this.deleteUser.execute({ email: userCreated.email });
      throw new Error('Error sending verification code');
    }
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateUserBody,
    @ReqUserDecorator() user: { id: UUID }
  ): Promise<GetUserResponse | null> {
    if (user.id !== id) {
      throw new ForbiddenException('Access denied');
    }

    const { data: userUpdated } = await this.updateUser.execute({
      update_by: 'id',
      user_data: {
        ...dto,
        id
      }
    });
    if (!userUpdated) {
      throw new Error('Error updating user');
    }
    return { data: userUpdated as ResponseUserDTO };
  }
}