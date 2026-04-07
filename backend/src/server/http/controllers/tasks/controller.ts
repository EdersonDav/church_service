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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { UUID } from 'crypto';

import {
  CreateTask,
  DeleteTask,
  GetTask,
  ListTasksBySector,
  UpdateTask,
} from '../../../../core/use-cases/tasks';
import { GetSector } from '../../../../core/use-cases/sectors';
import { GetUserSector } from '../../../../core/use-cases/user-sector';
import { GetUserChurch } from '../../../../core/use-cases/user-church';
import { AuthGuard, SectorGuard } from '../../../../core/guards';
import { ReqUserDecorator } from '../../../../common';
import {
  CreateTaskBody,
  CreateTaskResponseData,
  GetTaskResponse,
  ListTasksResponse,
  UpdateTaskBody,
  UpdateTaskResponseData,
} from '../../dtos/tasks';

@ApiTags('Tarefas')
@ApiBearerAuth()
@Controller('churches/:church_id/sectors/:sector_id/tasks')
export class TaskController {
  constructor(
    private readonly createTask: CreateTask,
    private readonly listTasksBySector: ListTasksBySector,
    private readonly getTask: GetTask,
    private readonly updateTask: UpdateTask,
    private readonly deleteTask: DeleteTask,
    private readonly getSector: GetSector,
    private readonly getUserSector: GetUserSector,
    private readonly getUserChurch: GetUserChurch,
  ) { }

  private async ensureSector(church_id: UUID, sector_id: UUID) {
    const { data } = await this.getSector.execute({ search_by: 'id', search_data: sector_id });

    if (!data || data.church?.id !== church_id) {
      throw new BadRequestException('Sector not found for this church');
    }

    return data;
  }

  private async ensureMembership(user_id: UUID, church_id: UUID, sector_id: UUID): Promise<void> {
    const [{ data: churchRelation }, { data: sectorRelation }] = await Promise.all([
      this.getUserChurch.execute({ user_id, church_id }),
      this.getUserSector.execute({ user_id, sector_id }),
    ]);

    if (!churchRelation && !sectorRelation) {
      throw new ForbiddenException('Access denied');
    }
  }

  @Post('')
  @UseGuards(AuthGuard, SectorGuard)
  @ApiOperation({ summary: 'Criar uma tarefa para um setor específico' })
  @ApiParam({ name: 'church_id', description: 'Identificador da igreja', type: String })
  @ApiParam({ name: 'sector_id', description: 'Identificador do setor', type: String })
  @ApiBody({
    type: CreateTaskBody,
    description: 'Dados utilizados para criar uma nova tarefa',
    examples: {
      default: {
        summary: 'Tarefa de louvor',
        value: {
          name: 'Ministro de Louvor',
          icon: 'https://cdn.example.com/icons/worship.png',
          description: 'Responsável por conduzir os momentos de louvor',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Tarefa criada com sucesso',
    schema: {
      example: {
        id: '0b752e60-0f75-4314-b9f4-1f0d4a1f4f23',
        name: 'Ministro de Louvor',
        icon: 'https://cdn.example.com/icons/worship.png',
        description: 'Responsável por conduzir os momentos de louvor',
        sector_id: 'f8f1e6d8-9e58-4d0e-94dc-70f6e0a3b2f5',
      },
    },
  })
  async create(
    @Param('church_id') church_id: UUID,
    @Param('sector_id') sector_id: UUID,
    @Body() body: CreateTaskBody,
  ): Promise<CreateTaskResponseData> {
    if (!body.name) {
      throw new BadRequestException('Name is necessary');
    }

    await this.ensureSector(church_id, sector_id);

    const { data } = await this.createTask.execute({ ...body, sector_id });

    return plainToClass(CreateTaskResponseData, data, {
      excludeExtraneousValues: true,
    });
  }

  @Get('')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Listar todas as tarefas de um setor' })
  @ApiParam({ name: 'church_id', description: 'Identificador da igreja', type: String })
  @ApiParam({ name: 'sector_id', description: 'Identificador do setor', type: String })
  @ApiOkResponse({
    description: 'Lista de tarefas recuperada com sucesso',
    schema: {
      example: {
        tasks: [
          {
            id: '0b752e60-0f75-4314-b9f4-1f0d4a1f4f23',
            name: 'Ministro de Louvor',
            icon: 'https://cdn.example.com/icons/worship.png',
            description: 'Responsável por conduzir os momentos de louvor',
            sector_id: 'f8f1e6d8-9e58-4d0e-94dc-70f6e0a3b2f5',
          },
        ],
      },
    },
  })
  async list(
    @Param('church_id') church_id: UUID,
    @Param('sector_id') sector_id: UUID,
    @ReqUserDecorator() user: { id: UUID },
  ): Promise<ListTasksResponse> {
    await this.ensureSector(church_id, sector_id);
    await this.ensureMembership(user.id, church_id, sector_id);

    const { data } = await this.listTasksBySector.execute({ sector_id });

    return plainToClass(ListTasksResponse, { tasks: data }, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':task_id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Buscar detalhes de uma tarefa específica' })
  @ApiParam({ name: 'church_id', description: 'Identificador da igreja', type: String })
  @ApiParam({ name: 'sector_id', description: 'Identificador do setor', type: String })
  @ApiParam({ name: 'task_id', description: 'Identificador da tarefa', type: String })
  @ApiOkResponse({
    description: 'Tarefa encontrada com sucesso',
    schema: {
      example: {
        task: {
          id: '0b752e60-0f75-4314-b9f4-1f0d4a1f4f23',
          name: 'Ministro de Louvor',
          icon: 'https://cdn.example.com/icons/worship.png',
          description: 'Responsável por conduzir os momentos de louvor',
          sector_id: 'f8f1e6d8-9e58-4d0e-94dc-70f6e0a3b2f5',
        },
      },
    },
  })
  async get(
    @Param('church_id') church_id: UUID,
    @Param('sector_id') sector_id: UUID,
    @Param('task_id') task_id: UUID,
    @ReqUserDecorator() user: { id: UUID },
  ): Promise<GetTaskResponse> {
    await this.ensureSector(church_id, sector_id);
    await this.ensureMembership(user.id, church_id, sector_id);

    const { data } = await this.getTask.execute({ task_id });

    if (!data || data.sector_id !== sector_id) {
      throw new BadRequestException('Task not found in this sector');
    }

    return plainToClass(GetTaskResponse, { task: data }, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':task_id')
  @UseGuards(AuthGuard, SectorGuard)
  @ApiOperation({ summary: 'Atualizar os dados de uma tarefa' })
  @ApiParam({ name: 'church_id', description: 'Identificador da igreja', type: String })
  @ApiParam({ name: 'sector_id', description: 'Identificador do setor', type: String })
  @ApiParam({ name: 'task_id', description: 'Identificador da tarefa', type: String })
  @ApiBody({
    type: UpdateTaskBody,
    description: 'Campos que podem ser atualizados na tarefa',
    examples: {
      default: {
        summary: 'Atualização parcial',
        value: {
          name: 'Ministro auxiliar',
          description: 'Auxilia o líder de louvor nas ministrações',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Tarefa atualizada com sucesso',
    schema: {
      example: {
        id: '0b752e60-0f75-4314-b9f4-1f0d4a1f4f23',
        name: 'Ministro auxiliar',
        icon: 'https://cdn.example.com/icons/worship.png',
        description: 'Auxilia o líder de louvor nas ministrações',
        sector_id: 'f8f1e6d8-9e58-4d0e-94dc-70f6e0a3b2f5',
      },
    },
  })
  async update(
    @Param('church_id') church_id: UUID,
    @Param('sector_id') sector_id: UUID,
    @Param('task_id') task_id: UUID,
    @Body() body: UpdateTaskBody,
  ): Promise<UpdateTaskResponseData> {
    await this.ensureSector(church_id, sector_id);

    if (!body.name && !body.icon && !body.description) {
      throw new BadRequestException('No changes provided');
    }

    const { data: currentTask } = await this.getTask.execute({ task_id });

    if (!currentTask || currentTask.sector_id !== sector_id) {
      throw new BadRequestException('Task not found in this sector');
    }

    const { data } = await this.updateTask.execute({ task_id, task_data: body });

    if (!data) {
      throw new BadRequestException('Error updating task');
    }

    return plainToClass(UpdateTaskResponseData, data, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':task_id')
  @UseGuards(AuthGuard, SectorGuard)
  @ApiOperation({ summary: 'Remover uma tarefa de um setor' })
  @ApiParam({ name: 'church_id', description: 'Identificador da igreja', type: String })
  @ApiParam({ name: 'sector_id', description: 'Identificador do setor', type: String })
  @ApiParam({ name: 'task_id', description: 'Identificador da tarefa', type: String })
  @ApiOkResponse({
    description: 'Tarefa removida com sucesso',
    schema: {
      example: {
        message: 'Task deleted successfully',
      },
    },
  })
  async delete(
    @Param('church_id') church_id: UUID,
    @Param('sector_id') sector_id: UUID,
    @Param('task_id') task_id: UUID,
  ): Promise<{ message: string }> {
    await this.ensureSector(church_id, sector_id);

    const { data } = await this.getTask.execute({ task_id });

    if (!data || data.sector_id !== sector_id) {
      throw new BadRequestException('Task not found in this sector');
    }

    await this.deleteTask.execute({ task_id });

    return { message: 'Task deleted successfully' };
  }
}
