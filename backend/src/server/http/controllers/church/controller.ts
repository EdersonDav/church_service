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
  Patch,
  ForbiddenException,
  Query
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

import { CreateChurch, DeleteChurch, ListChurches, UpdateChurch } from '../../../../core/use-cases/church';
import { CreateUserChurch, DeleteUserChurch, GetUserChurch } from '../../../../core/use-cases/user-church';
import { DeleteUserSectorsByChurch } from '../../../../core/use-cases/user-sector';
import {
  CreateChurchResponseData,
  CreateChurchBody,
  GetChurchUserResponse,
  ListChurchesResponse,
  UpdateChurchBody,
  UpdateChurchResponseData
} from '../../dtos';
import { AuthGuard, ChurchRoleGuard } from '../../../../core/guards';
import { UUID } from 'crypto';
import { ReqUserDecorator } from '../../../../common';
import { ChurchRoleEnum } from '../../../../enums';
import { ChurchJoinRequestStatusEnum } from '../../../../database/entities';
import { ChurchJoinRequestRepository, ChurchRepository } from '../../../../database/repositories/interfaces';

@ApiTags('Igrejas')
@ApiBearerAuth()
@Controller('churches')
export class ChurchController {
  constructor(
    private readonly createChurch: CreateChurch,
    private readonly createUserChurch: CreateUserChurch,
    private readonly getUserChurch: GetUserChurch,
    private readonly deleteChurch: DeleteChurch,
    private readonly updateChurch: UpdateChurch,
    private readonly listChurches: ListChurches,
    private readonly churchRepository: ChurchRepository,
    private readonly churchJoinRequestRepository: ChurchJoinRequestRepository,
    private readonly deleteUserChurch: DeleteUserChurch,
    private readonly deleteUserSectorsByChurch: DeleteUserSectorsByChurch
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
      description: body.description,
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

  @Get('')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Listar igrejas cadastradas' })
  @ApiOkResponse({
    description: 'Lista de igrejas retornada com sucesso',
    schema: {
      example: {
        churches: [
          {
            id: 'e8c7a0b9-7a0c-4f1d-8a3e-5f3c1e6b3a1f',
            name: 'Igreja Vida em Cristo',
            description: 'Comunidade localizada no centro da cidade',
            created_at: '2024-05-11T12:00:00.000Z',
            updated_at: '2024-05-11T12:00:00.000Z',
          },
        ],
      },
    },
  })
  async list(
    @ReqUserDecorator() user: { id: UUID }
  ): Promise<ListChurchesResponse> {
    const { data } = await this.listChurches.execute({ user_id: user.id });

    return plainToClass(ListChurchesResponse, { churches: data }, {
      excludeExtraneousValues: true
    });
  }

  @Get('search')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Buscar igrejas cadastradas para solicitação de entrada' })
  async search(
    @ReqUserDecorator() user: { id: UUID },
    @Query('name') name?: string
  ) {
    const churches = await this.churchRepository.list();
    const searchTerm = name?.trim().toLowerCase();
    const filteredChurches = searchTerm
      ? churches.filter((church) => church.name.toLowerCase().includes(searchTerm))
      : churches;
    const userChurches = await Promise.all(
      filteredChurches.map((church) =>
        this.getUserChurch.execute({
          church_id: church.id,
          user_id: user.id,
        }),
      ),
    );

    return {
      churches: filteredChurches.map((church, index) => ({
        id: church.id,
        name: church.name,
        description: church.description,
        created_at: church.created_at,
        updated_at: church.updated_at,
        role: userChurches[index].data?.role ?? null,
      })),
    };
  }

  @Get('join-requests')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Listar solicitações pendentes para igrejas administradas' })
  async listJoinRequests(
    @ReqUserDecorator() user: { id: UUID }
  ) {
    const requests = await this.churchJoinRequestRepository.listPendingForAdmin(user.id);

    return {
      requests: requests.map((request) => ({
        id: request.id,
        status: request.status,
        church_id: request.church_id,
        user_id: request.user_id,
        created_at: request.created_at,
        updated_at: request.updated_at,
        church: request.church
          ? {
            id: request.church.id,
            name: request.church.name,
            description: request.church.description,
          }
          : undefined,
        user: request.user
          ? {
            id: request.user.id,
            name: request.user.name,
            email: request.user.email,
          }
          : undefined,
      })),
    };
  }

  @Post('join-requests/:request_id/approve')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Aprovar solicitação de entrada em uma igreja' })
  async approveJoinRequest(
    @Param('request_id') request_id: UUID,
    @ReqUserDecorator() user: { id: UUID }
  ): Promise<{ message: string }> {
    const request = await this.churchJoinRequestRepository.getById(request_id);

    if (!request || request.status !== ChurchJoinRequestStatusEnum.PENDING) {
      throw new NotFoundException('Join request not found');
    }

    const { data: adminChurch } = await this.getUserChurch.execute({
      church_id: request.church_id,
      user_id: user.id,
    });

    if (!adminChurch || ![ChurchRoleEnum.ADMIN, ChurchRoleEnum.ROOT].includes(adminChurch.role)) {
      throw new ForbiddenException('Only church admins can approve join requests');
    }

    const { data: currentMember } = await this.getUserChurch.execute({
      church_id: request.church_id,
      user_id: request.user_id,
    });

    if (!currentMember) {
      await this.createUserChurch.execute({
        church_id: request.church_id,
        user_id: request.user_id,
        role: ChurchRoleEnum.VOLUNTARY,
      });
    }

    await this.churchJoinRequestRepository.updateStatus(request.id, ChurchJoinRequestStatusEnum.APPROVED);

    return { message: 'Join request approved' };
  }

  @Post(':church_id/join')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Solicitar entrada em uma igreja como voluntário' })
  @ApiParam({ name: 'church_id', description: 'Identificador da igreja', type: String })
  @ApiOkResponse({
    description: 'Solicitação enviada com sucesso',
    schema: {
      example: {
        message: 'Join request sent',
      },
    },
  })
  async join(
    @Param('church_id') church_id: UUID,
    @ReqUserDecorator() user: { id: UUID }
  ): Promise<{ message: string }> {
    const churchExists = await this.churchRepository.getBy(church_id, 'id');

    if (!churchExists) {
      throw new NotFoundException('Church not found');
    }

    const { data: church } = await this.getUserChurch.execute({
      church_id,
      user_id: user.id,
    });

    if (church) {
      return { message: 'Already part of this church' };
    }

    const currentRequest = await this.churchJoinRequestRepository.getByUserAndChurch(user.id, church_id);

    if (currentRequest?.status === ChurchJoinRequestStatusEnum.PENDING) {
      return { message: 'Join request already sent' };
    }

    await this.churchJoinRequestRepository.save({
      church_id,
      user_id: user.id,
      status: ChurchJoinRequestStatusEnum.PENDING,
    });

    return { message: 'Join request sent' };
  }

  @Delete(':church_id/leave')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Sair de uma igreja vinculada ao usuário logado' })
  @ApiParam({ name: 'church_id', description: 'Identificador da igreja', type: String })
  async leave(
    @Param('church_id') church_id: UUID,
    @ReqUserDecorator() user: { id: UUID }
  ): Promise<{ message: string }> {
    const { data: membership } = await this.getUserChurch.execute({
      church_id,
      user_id: user.id,
    });

    if (!membership) {
      throw new BadRequestException('User is not part of this church');
    }

    await Promise.all([
      this.deleteUserChurch.execute({ church_id, user_id: user.id }),
      this.deleteUserSectorsByChurch.execute({ church_id, user_id: user.id }),
    ]);

    return { message: 'Left church successfully' };
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
