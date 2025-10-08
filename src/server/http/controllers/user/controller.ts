import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { CreateVerificationCode } from '../../../../core/use-cases/verification-code/create';
import { SendUserAlreadyExists, SendVerifyCode } from '../../../../core/use-cases/emails';
import {
  CreateUserBody,
  CreateUserResponse,
  GetUserParam,
  GetUserResponse,
  ResponseUserDTO,
  UpdateUserBody,
  UpdateUserTasksBody,
  UserTasksResponse,
} from '../../dtos';
import {
  CreateUnavailabilityBody,
  ListUnavailabilityResponse,
  UnavailabilityDto,
} from '../../dtos/unavailability';
import {
  CreateUser,
  GetUser,
  DeleteUser,
  UpdateUser
} from '../../../../core/use-cases/user';
import { SetUserTasks, ListUserTasks } from '../../../../core/use-cases/user-task';
import {
  CreateUnavailability,
  DeleteUnavailability,
  ListUserUnavailability
} from '../../../../core/use-cases/unavailability';
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
    private readonly sendVerifyCode: SendVerifyCode,
    private readonly setUserTasks: SetUserTasks,
    private readonly listUserTasks: ListUserTasks,
    private readonly createUnavailability: CreateUnavailability,
    private readonly deleteUnavailability: DeleteUnavailability,
    private readonly listUserUnavailability: ListUserUnavailability,
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

  @Get(':id/tasks')
  @UseGuards(AuthGuard)
  async getTasks(
    @Param('id') id: string,
    @ReqUserDecorator() user: { id: UUID }
  ): Promise<UserTasksResponse> {
    if (user.id !== id) {
      throw new ForbiddenException('Access denied');
    }

    const { data } = await this.listUserTasks.execute({ user_id: id });

    return plainToClass(UserTasksResponse, { tasks: data }, {
      excludeExtraneousValues: true,
    });
  }

  @Put(':id/tasks')
  @UseGuards(AuthGuard)
  async updateTasks(
    @Param('id') id: string,
    @Body() body: UpdateUserTasksBody,
    @ReqUserDecorator() user: { id: UUID }
  ): Promise<UserTasksResponse> {
    if (user.id !== id) {
      throw new ForbiddenException('Access denied');
    }

    const { data } = await this.setUserTasks.execute({
      user_id: id,
      task_ids: body.task_ids,
    });

    return plainToClass(UserTasksResponse, { tasks: data }, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id/unavailability')
  @UseGuards(AuthGuard)
  async listUnavailability(
    @Param('id') id: string,
    @ReqUserDecorator() user: { id: UUID }
  ): Promise<ListUnavailabilityResponse> {
    if (user.id !== id) {
      throw new ForbiddenException('Access denied');
    }

    const { data } = await this.listUserUnavailability.execute({ user_id: id });

    return plainToClass(ListUnavailabilityResponse, { items: data }, {
      excludeExtraneousValues: true,
    });
  }

  @Post(':id/unavailability')
  @UseGuards(AuthGuard)
  async createUnavailabilityHandler(
    @Param('id') id: string,
    @Body() body: CreateUnavailabilityBody,
    @ReqUserDecorator() user: { id: UUID }
  ): Promise<UnavailabilityDto> {
    if (user.id !== id) {
      throw new ForbiddenException('Access denied');
    }

    const date = new Date(body.date);

    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException('Invalid date');
    }

    const { data } = await this.createUnavailability.execute({
      user_id: id,
      date,
    });

    return plainToClass(UnavailabilityDto, data, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id/unavailability/:unavailability_id')
  @UseGuards(AuthGuard)
  async deleteUnavailabilityHandler(
    @Param('id') id: string,
    @Param('unavailability_id') unavailability_id: string,
    @ReqUserDecorator() user: { id: UUID }
  ): Promise<{ message: string }> {
    if (user.id !== id) {
      throw new ForbiddenException('Access denied');
    }

    const { data } = await this.listUserUnavailability.execute({ user_id: id });

    const target = data.find((item) => item.id === unavailability_id);

    if (!target) {
      throw new BadRequestException('Unavailability not found');
    }

    await this.deleteUnavailability.execute({ unavailability_id });

    return { message: 'Unavailability removed' };
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