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

import {
  CreateSectorResponseData,
  CreateSectorBody,
  GetSectorUserResponse,
  UpdateSectorBody,
  UpdateSectorResponseData
} from '../../dtos';
import { AuthGuard, SectorGuard } from '../../../../core/guards';
import { UUID } from 'crypto';
import { ReqUserDecorator } from '../../../../common';
import { SectorRoleEnum } from '../../../../enums';
import { CreateSector, UpdateSector, DeleteSector } from '../../../../core/use-cases/sectors';
import { CreateUserSector, GetUserSector } from '../../../../core/use-cases/user-sector';
import { GetChurch } from '../../../../core/use-cases/church/get';

@ApiTags('Setores')
@ApiBearerAuth()
@Controller(':church_id/sectors')
export class SectorController {
  constructor(
    private readonly createSector: CreateSector,
    private readonly createUserSector: CreateUserSector,
    private readonly getUserSector: GetUserSector,
    private readonly deleteSector: DeleteSector,
    private readonly updateSector: UpdateSector,
    private readonly getChurch: GetChurch
  ) { }

  @Post('')
  @UseGuards(AuthGuard, SectorGuard)
  @ApiOperation({ summary: 'Criar um novo setor na igreja' })
  @ApiParam({ name: 'church_id', description: 'Identificador da igreja', type: String })
  @ApiBody({
    type: CreateSectorBody,
    description: 'Dados para criação do setor',
    examples: {
      default: {
        summary: 'Setor de música',
        value: {
          name: 'Ministério de Louvor',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Setor criado com sucesso',
    schema: {
      example: {
        id: 'a7b5d4c2-6f8e-4b3a-9d2c-1e0f5a6b7c8d',
        name: 'Ministério de Louvor',
        church_id: 'e8c7a0b9-7a0c-4f1d-8a3e-5f3c1e6b3a1f',
        created_at: '2024-05-11T12:00:00.000Z',
        updated_at: '2024-05-11T12:00:00.000Z',
      },
    },
  })
  async create(
    @Body() body: CreateSectorBody,
    @ReqUserDecorator() user: { id: UUID },
    @Param('church_id') church_id: UUID
  ): Promise<CreateSectorResponseData> {
    if (!body.name) {
      throw new BadRequestException('Name is necessary');
    }

    const church = await this.getChurch.execute({ search_by: 'id', search_data: church_id });

    if (!church.data) {
      throw new NotFoundException('Church not found');
    }

    const { data } = await this.createSector.execute({
      name: body.name,
      church: church.data,
    });

    if (!data.name || !data.id) {
      throw new BadRequestException('Error creating church');
    }

    try {
      await this.createUserSector.execute({
        sector_id: data.id,
        user_id: user.id,
        role: SectorRoleEnum.ADMIN
      });

      return plainToClass(CreateSectorResponseData, data, {
        excludeExtraneousValues: true
      });

    } catch (error) {
      console.error('Error creating sector:', error);
      await this.deleteSector.execute({
        sector_id: data.id,
      });

      throw new BadRequestException('Error creating sector');

    }
  }

  @Get(':sector_id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Consultar dados do setor vinculado ao usuário' })
  @ApiParam({ name: 'church_id', description: 'Identificador da igreja', type: String, required: false })
  @ApiParam({ name: 'sector_id', description: 'Identificador do setor', type: String })
  @ApiOkResponse({
    description: 'Setor encontrado com sucesso',
    schema: {
      example: {
        id: 'a7b5d4c2-6f8e-4b3a-9d2c-1e0f5a6b7c8d',
        name: 'Ministério de Louvor',
        role: 'ADMIN',
      },
    },
  })
  async get(
    @Param('sector_id') sector_id: UUID,
    @ReqUserDecorator() user: { id: UUID }
  ): Promise<GetSectorUserResponse> {
    const { data } = await this.getUserSector.execute({
      user_id: user.id,
      sector_id
    });

    if (!data) {
      throw new NotFoundException('Church not found');
    }

    return plainToClass(GetSectorUserResponse, data, {
      excludeExtraneousValues: true
    });
  }

  @Delete(':sector_id')
  @UseGuards(AuthGuard, SectorGuard)
  @ApiOperation({ summary: 'Remover um setor' })
  @ApiParam({ name: 'sector_id', description: 'Identificador do setor', type: String })
  @ApiOkResponse({
    description: 'Setor removido com sucesso',
    schema: {
      example: {
        message: 'Sector deleted successfully',
      },
    },
  })
  async delete(
    @Param('sector_id') sector_id: UUID,
  ): Promise<{ message: string }> {
    await this.deleteSector.execute({
      sector_id
    });

    return { message: 'Sector deleted successfully' };
  }

  @Patch(':sector_id')
  @UseGuards(AuthGuard, SectorGuard)
  @ApiOperation({ summary: 'Atualizar informações de um setor' })
  @ApiParam({ name: 'sector_id', description: 'Identificador do setor', type: String })
  @ApiBody({
    type: UpdateSectorBody,
    description: 'Campos que podem ser atualizados',
    examples: {
      default: {
        summary: 'Atualização do nome',
        value: {
          name: 'Ministério de Louvor Jovem',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Setor atualizado com sucesso',
    schema: {
      example: {
        id: 'a7b5d4c2-6f8e-4b3a-9d2c-1e0f5a6b7c8d',
        name: 'Ministério de Louvor Jovem',
        church_id: 'e8c7a0b9-7a0c-4f1d-8a3e-5f3c1e6b3a1f',
        created_at: '2024-05-11T12:00:00.000Z',
        updated_at: '2024-06-01T10:00:00.000Z',
      },
    },
  })
  async update(
    @Param('sector_id') sector_id: UUID,
    @Body() body: UpdateSectorBody
  ): Promise<UpdateSectorResponseData> {
    if (!body.name) {
      throw new BadRequestException('Name is necessary');
    }

    const { data } = await this.updateSector.execute({
      sector_id,
      sector_data: body
    });

    if (!data?.id) {
      throw new BadRequestException('Error updating sector');
    }

    return plainToClass(UpdateSectorResponseData, data, {
      excludeExtraneousValues: true
    });
  }
}