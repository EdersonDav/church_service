import {
  Body,
  Controller,
  Post,
  BadRequestException,
  UseGuards,
  Param,
  Get,
  NotFoundException,
  Delete,
  Patch
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

import { CreateChurch, DeleteChurch, UpdateChurch } from '../../../../core/use-cases/church';
import { CreateUserChurch, GetUserChurch } from '../../../../core/use-cases/user-church';
import {
  CreateChurchResponseData,
  CreateChurchBody,
  GetChurchUserResponse,
  UpdateChurchBody,
  UpdateChurchResponseData
} from '../../dtos';
import { AuthGuard, ChurchRoleGuard } from '../../../../core/guards';
import { UUID } from 'crypto';
import { ReqUserDecorator } from '../../../../common';
import { ChurchRoleEnum } from '../../../../enums';

@ApiTags('Igrejas')
@ApiBearerAuth()
@Controller('churches')
export class ChurchController {
  constructor(
    private readonly createChurch: CreateChurch,
    private readonly createUserChurch: CreateUserChurch,
    private readonly getUserChurch: GetUserChurch,
    private readonly deleteChurch: DeleteChurch,
    private readonly updateChurch: UpdateChurch
  ) { }

  @Post('')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Criar uma nova igreja' })
  @ApiBody({
    type: CreateChurchBody,
    description: 'Dados para criação da igreja',
    examples: {
      default: {
        summary: 'Igreja local',
        value: {
          name: 'Igreja Vida em Cristo',
          description: 'Comunidade localizada no centro da cidade',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Igreja criada com sucesso',
    schema: {
      example: {
        id: 'e8c7a0b9-7a0c-4f1d-8a3e-5f3c1e6b3a1f',
        name: 'Igreja Vida em Cristo',
        description: 'Comunidade localizada no centro da cidade',
        created_at: '2024-05-11T12:00:00.000Z',
        updated_at: '2024-05-11T12:00:00.000Z',
      },
    },
  })
  async create(
    @Body() body: CreateChurchBody,
    @ReqUserDecorator() user: { id: UUID }
  ): Promise<CreateChurchResponseData> {
    if (!body.name) {
      throw new BadRequestException('Name is necessary');
    }

    const { data } = await this.createChurch.execute({
      name: body.name,
      user_id: user.id
    });

    if (!data.id) {
      throw new BadRequestException('Error creating church');
    }

    try {
      await this.createUserChurch.execute({
        church_id: data.id,
        user_id: user.id,
        role: ChurchRoleEnum.ADMIN
      });

      return data
    } catch (error) {
      console.error('Error creating church:', error);
      await this.deleteChurch.execute({
        church_id: data.id,
      });

      throw new BadRequestException('Error creating church');

    }
  }

  @Get(':church_id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Consultar dados da igreja vinculada ao usuário' })
  @ApiParam({ name: 'church_id', description: 'Identificador da igreja', type: String })
  @ApiOkResponse({
    description: 'Dados da igreja retornados com sucesso',
    schema: {
      example: {
        id: 'e8c7a0b9-7a0c-4f1d-8a3e-5f3c1e6b3a1f',
        name: 'Igreja Vida em Cristo',
        description: 'Comunidade localizada no centro da cidade',
        created_at: '2024-05-11T12:00:00.000Z',
        updated_at: '2024-05-11T12:00:00.000Z',
        role: 'ADMIN',
      },
    },
  })
  async get(
    @Param('church_id') church_id: UUID,
    @ReqUserDecorator() user: { id: UUID }
  ): Promise<GetChurchUserResponse> {
    const { data } = await this.getUserChurch.execute({
      user_id: user.id,
      church_id
    });

    if (!data) {
      throw new NotFoundException('Church not found');
    }

    return plainToClass(GetChurchUserResponse, data, {
      excludeExtraneousValues: true
    });
  }

  @Delete(':church_id')
  @UseGuards(AuthGuard, ChurchRoleGuard)
  @ApiOperation({ summary: 'Excluir uma igreja' })
  @ApiParam({ name: 'church_id', description: 'Identificador da igreja', type: String })
  @ApiOkResponse({
    description: 'Igreja excluída com sucesso',
    schema: {
      example: {
        message: 'Church deleted successfully',
      },
    },
  })
  async delete(
    @Param('church_id') church_id: UUID,
  ): Promise<{ message: string }> {
    await this.deleteChurch.execute({
      church_id
    });

    return { message: 'Church deleted successfully' };
  }

  @Patch(':church_id')
  @UseGuards(AuthGuard, ChurchRoleGuard)
  @ApiOperation({ summary: 'Atualizar informações da igreja' })
  @ApiParam({ name: 'church_id', description: 'Identificador da igreja', type: String })
  @ApiBody({
    type: UpdateChurchBody,
    description: 'Campos que podem ser atualizados',
    examples: {
      default: {
        summary: 'Alteração do nome',
        value: {
          name: 'Igreja Vida em Cristo - Centro',
          description: 'Comunidade localizada no centro da cidade',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Igreja atualizada com sucesso',
    schema: {
      example: {
        id: 'e8c7a0b9-7a0c-4f1d-8a3e-5f3c1e6b3a1f',
        name: 'Igreja Vida em Cristo - Centro',
        description: 'Comunidade localizada no centro da cidade',
        created_at: '2024-05-11T12:00:00.000Z',
        updated_at: '2024-06-01T10:00:00.000Z',
      },
    },
  })
  async update(
    @Param('church_id') church_id: UUID,
    @Body() body: UpdateChurchBody
  ): Promise<UpdateChurchResponseData> {
    if (!body.name) {
      throw new BadRequestException('Name is necessary');
    }

    const { data } = await this.updateChurch.execute({
      church_id,
      church_data: body
    });

    if (!data?.id) {
      throw new BadRequestException('Error updating church');
    }

    return plainToClass(UpdateChurchResponseData, data, {
      excludeExtraneousValues: true
    });
  }
}