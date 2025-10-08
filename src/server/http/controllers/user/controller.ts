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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
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

@ApiTags('Usuários')
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
  @ApiOperation({ summary: 'Buscar usuário pelo e-mail' })
  @ApiParam({ name: 'email', description: 'E-mail do usuário', type: String })
  @ApiOkResponse({
    description: 'Usuário recuperado com sucesso',
    schema: {
      example: {
        data: {
          id: 'c7d1435a-2308-4a4c-9f36-3c0dca1b7f4d',
          name: 'Maria Souza',
          email: 'maria.souza@example.com',
          birthday: '1990-05-12',
          is_verified: true,
        },
      },
    },
  })
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
  @ApiOperation({ summary: 'Registrar um novo usuário' })
  @ApiBody({
    type: CreateUserBody,
    description: 'Dados utilizados para cadastro do usuário',
    examples: {
      default: {
        summary: 'Cadastro com dados válidos',
        value: {
          name: 'Maria Souza',
          email: 'maria.souza@example.com',
          password: 'Strong#Password1',
          birthday: '1990-05-12',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Resultado do processo de cadastro',
    schema: {
      example: {
        message: 'Verify your email',
      },
    },
  })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar tarefas vinculadas ao usuário' })
  @ApiParam({ name: 'id', description: 'Identificador do usuário', type: String })
  @ApiOkResponse({
    description: 'Tarefas retornadas com sucesso',
    schema: {
      example: {
        tasks: [
          {
            id: '0b752e60-0f75-4314-b9f4-1f0d4a1f4f23',
            name: 'Ministro de Louvor',
            icon: 'https://cdn.example.com/icons/worship.png',
            description: 'Responsável por conduzir o louvor',
            sector_id: 'f8f1e6d8-9e58-4d0e-94dc-70f6e0a3b2f5',
          },
        ],
      },
    },
  })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Definir tarefas vinculadas ao usuário' })
  @ApiParam({ name: 'id', description: 'Identificador do usuário', type: String })
  @ApiBody({
    type: UpdateUserTasksBody,
    description: 'Lista de tarefas atribuídas ao usuário',
    examples: {
      default: {
        summary: 'Definição de tarefas',
        value: {
          task_ids: [
            '0b752e60-0f75-4314-b9f4-1f0d4a1f4f23',
            '1c2d3e4f-5a6b-7c8d-9e0f-1234567890ab',
          ],
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Tarefas atualizadas com sucesso',
    schema: {
      example: {
        tasks: [
          {
            id: '0b752e60-0f75-4314-b9f4-1f0d4a1f4f23',
            name: 'Ministro de Louvor',
            icon: 'https://cdn.example.com/icons/worship.png',
            description: 'Responsável por conduzir o louvor',
            sector_id: 'f8f1e6d8-9e58-4d0e-94dc-70f6e0a3b2f5',
          },
          {
            id: '1c2d3e4f-5a6b-7c8d-9e0f-1234567890ab',
            name: 'Baterista',
            sector_id: 'f8f1e6d8-9e58-4d0e-94dc-70f6e0a3b2f5',
          },
        ],
      },
    },
  })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar indisponibilidades cadastradas para o usuário' })
  @ApiParam({ name: 'id', description: 'Identificador do usuário', type: String })
  @ApiOkResponse({
    description: 'Lista de indisponibilidades retornada com sucesso',
    schema: {
      example: {
        items: [
          {
            id: 'd51c7c49-03f1-4243-9b27-77c7c3d3dfd5',
            date: '2024-07-01T00:00:00.000Z',
          },
        ],
      },
    },
  })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Registrar uma nova indisponibilidade para o usuário' })
  @ApiParam({ name: 'id', description: 'Identificador do usuário', type: String })
  @ApiBody({
    type: CreateUnavailabilityBody,
    description: 'Data da indisponibilidade em formato ISO 8601',
    examples: {
      default: {
        summary: 'Indisponibilidade para viajar',
        value: {
          date: '2024-07-01T00:00:00.000Z',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Indisponibilidade criada com sucesso',
    schema: {
      example: {
        id: 'd51c7c49-03f1-4243-9b27-77c7c3d3dfd5',
        date: '2024-07-01T00:00:00.000Z',
      },
    },
  })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover uma indisponibilidade cadastrada' })
  @ApiParam({ name: 'id', description: 'Identificador do usuário', type: String })
  @ApiParam({ name: 'unavailability_id', description: 'Identificador da indisponibilidade', type: String })
  @ApiOkResponse({
    description: 'Indisponibilidade removida com sucesso',
    schema: {
      example: {
        message: 'Unavailability removed',
      },
    },
  })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar dados do usuário autenticado' })
  @ApiParam({ name: 'id', description: 'Identificador do usuário', type: String })
  @ApiBody({
    type: UpdateUserBody,
    description: 'Campos permitidos para atualização',
    examples: {
      default: {
        summary: 'Atualização de nome e data de nascimento',
        value: {
          name: 'Maria S. Oliveira',
          birthday: '1991-03-20',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Usuário atualizado com sucesso',
    schema: {
      example: {
        data: {
          id: 'c7d1435a-2308-4a4c-9f36-3c0dca1b7f4d',
          name: 'Maria S. Oliveira',
          email: 'maria.souza@example.com',
          birthday: '1991-03-20',
          is_verified: true,
        },
      },
    },
  })
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