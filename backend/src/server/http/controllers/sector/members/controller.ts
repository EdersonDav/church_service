import {
  Body,
  Controller,
  Post,
  UseGuards,
  Param,
  BadRequestException,
  Get,
  Patch,
  Put,
  Delete,
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

import {
  CreateUserSector,
  DeleteUserSector,
  GetUserSector,
  GetUserSectorMembers
} from '../../../../../core/use-cases/user-sector';
import { GetNotVerifiedUser, GetUser } from '../../../../../core/use-cases/user';
import {
  BodyMemberDTO,
  ResponseSectorMembersDTO,
  UpdateSectorMemberRoleBody
} from '../../../dtos';
import { AuthGuard, ChurchRoleGuard, SectorGuard } from '../../../../../core/guards';
import { UUID } from 'crypto';
import { ChurchRoleEnum, SectorRoleEnum } from '../../../../../enums';
import { GetUserChurch } from '../../../../../core/use-cases/user-church';
import { GetSector } from '../../../../../core/use-cases/sectors/get';
import { ReqUserDecorator } from '../../../../../common';
import { ListUserTasks, SetUserTasks } from '../../../../../core/use-cases/user-task';
import { UpdateUserTasksBody, UserTasksResponse } from '../../../dtos/user/tasks';

@ApiTags('Membros do Setor')
@ApiBearerAuth()
@Controller('churches/:church_id/sectors/:sector_id/members')
export class SectorMembersController {
  constructor(
    private readonly createUserSector: CreateUserSector,
    private readonly getUser: GetUser,
    private readonly getNotVerifiedUser: GetNotVerifiedUser,
    private readonly getUserSector: GetUserSector,
    private readonly getUserSectorMembers: GetUserSectorMembers,
    private readonly deleteUserSector: DeleteUserSector,
    private readonly getUserChurch: GetUserChurch,
    private readonly getSector: GetSector,
    private readonly listUserTasks: ListUserTasks,
    private readonly setUserTasks: SetUserTasks,
  ) { }

  private async ensureSectorBelongsToChurch(church_id: UUID, sector_id: UUID): Promise<void> {
    const { data: sector } = await this.getSector.execute({ search_by: 'id', search_data: sector_id });

    if (!sector) {
      throw new BadRequestException('Sector not found');
    }

    if (sector.church?.id && sector.church.id !== church_id) {
      throw new BadRequestException('Sector does not belong to this church');
    }
  }

  private async ensureValidChurchMember(church_id: UUID, member_id: UUID): Promise<void> {
    const { data: member } = await this.getUser.execute({ search_data: member_id, search_by: 'id' });
    if (!member || !member.email) {
      throw new BadRequestException('Invalid Member');
    }

    const { data: notVerifiedUser } = await this.getNotVerifiedUser.execute({ email: member.email });

    if (notVerifiedUser) {
      throw new BadRequestException('Member is not verified');
    }

    const { data: churchMember } = await this.getUserChurch.execute({ church_id, user_id: member_id });

    if (!churchMember) {
      throw new BadRequestException('Member is not part of this church');
    }
  }

  private async ensureCanViewSectorMembers(
    user_id: UUID,
    church_id: UUID,
    sector_id: UUID,
  ): Promise<void> {
    const { data: churchMember } = await this.getUserChurch.execute({ church_id, user_id });

    if (
      churchMember?.role === ChurchRoleEnum.ADMIN ||
      churchMember?.role === ChurchRoleEnum.ROOT
    ) {
      return;
    }

    const { data: sectorMember } = await this.getUserSector.execute({ user_id, sector_id });

    if (sectorMember) {
      return;
    }

    throw new BadRequestException('Member is not part of this sector');
  }

  @Post('')
  @UseGuards(AuthGuard, SectorGuard)
  @ApiOperation({ summary: 'Adicionar um membro ao setor' })
  @ApiParam({ name: 'church_id', description: 'Identificador da igreja', type: String })
  @ApiParam({ name: 'sector_id', description: 'Identificador do setor', type: String })
  @ApiBody({
    type: BodyMemberDTO,
    description: 'Identificador do membro que será vinculado ao setor',
    examples: {
      default: {
        summary: 'Vincular membro existente ao setor',
        value: {
          member_id: '9dd66e36-9a45-4fcf-8e83-291bdfe7c1b8',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Membro adicionado ao setor com sucesso',
    schema: {
      example: {
        message: 'Member added to sector successfully',
      },
    },
  })
  async addMember(
    @Body() body: BodyMemberDTO,
    @Param('church_id') church_id: UUID,
    @Param('sector_id') sector_id: UUID,
  ): Promise<{ message: string; }> {
    await this.ensureSectorBelongsToChurch(church_id, sector_id);
    await this.ensureValidChurchMember(church_id, body.member_id);

    await this.createUserSector.execute({
      sector_id,
      user_id: body.member_id,
      role: SectorRoleEnum.MEMBER,
    });

    return { message: 'Member added to sector successfully' };
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Listar membros cadastrados no setor' })
  @ApiParam({ name: 'church_id', description: 'Identificador da igreja', type: String })
  @ApiParam({ name: 'sector_id', description: 'Identificador do setor', type: String })
  @ApiOkResponse({
    description: 'Lista de membros do setor retornada com sucesso',
    schema: {
      example: {
        sector: {
          id: 'a7b5d4c2-6f8e-4b3a-9d2c-1e0f5a6b7c8d',
          name: 'Ministério de Louvor',
        },
        members: [
          {
            id: '9dd66e36-9a45-4fcf-8e83-291bdfe7c1b8',
            name: 'João Silva',
            email: 'joao.silva@example.com',
            is_verified: true,
          },
        ],
      },
    },
  })
  async getMembers(
    @Param('church_id') church_id: UUID,
    @Param('sector_id') sector_id: UUID,
    @ReqUserDecorator() user: { id: UUID },
  ): Promise<ResponseSectorMembersDTO> {
    await this.ensureSectorBelongsToChurch(church_id, sector_id);
    await this.ensureCanViewSectorMembers(user.id, church_id, sector_id);

    const { data: sector } = await this.getSector.execute({ search_by: 'id', search_data: sector_id });
    if (!sector) {
      throw new BadRequestException('Sector not found');
    }

    const { data: members } = await this.getUserSectorMembers.execute({ sector_id });

    return plainToClass(ResponseSectorMembersDTO, {
      sector,
      members: members?.members ?? [],
    });
  }

  @Get(':member_id/tasks')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Listar tarefas pre-definidas de um membro no setor' })
  @ApiParam({ name: 'church_id', description: 'Identificador da igreja', type: String })
  @ApiParam({ name: 'sector_id', description: 'Identificador do setor', type: String })
  @ApiParam({ name: 'member_id', description: 'Identificador do membro', type: String })
  async getMemberTasks(
    @Param('church_id') church_id: UUID,
    @Param('sector_id') sector_id: UUID,
    @Param('member_id') member_id: UUID,
    @ReqUserDecorator() user: { id: UUID },
  ): Promise<UserTasksResponse> {
    await this.ensureSectorBelongsToChurch(church_id, sector_id);
    await this.ensureCanViewSectorMembers(user.id, church_id, sector_id);

    const { data: relation } = await this.getUserSector.execute({ user_id: member_id, sector_id });
    if (!relation) {
      throw new BadRequestException('Member is not part of this sector');
    }

    const { data } = await this.listUserTasks.execute({ user_id: member_id, sector_id });

    return plainToClass(UserTasksResponse, { tasks: data }, {
      excludeExtraneousValues: true,
    });
  }

  @Put(':member_id/tasks')
  @UseGuards(AuthGuard, SectorGuard)
  @ApiOperation({ summary: 'Definir tarefas pre-definidas de um membro no setor' })
  @ApiParam({ name: 'church_id', description: 'Identificador da igreja', type: String })
  @ApiParam({ name: 'sector_id', description: 'Identificador do setor', type: String })
  @ApiParam({ name: 'member_id', description: 'Identificador do membro', type: String })
  @ApiBody({ type: UpdateUserTasksBody })
  async updateMemberTasks(
    @Param('church_id') church_id: UUID,
    @Param('sector_id') sector_id: UUID,
    @Param('member_id') member_id: UUID,
    @Body() body: UpdateUserTasksBody,
  ): Promise<UserTasksResponse> {
    await this.ensureSectorBelongsToChurch(church_id, sector_id);
    await this.ensureValidChurchMember(church_id, member_id);

    const { data: relation } = await this.getUserSector.execute({ user_id: member_id, sector_id });
    if (!relation) {
      throw new BadRequestException('Member is not part of this sector');
    }

    const { data } = await this.setUserTasks.execute({
      user_id: member_id,
      task_ids: body.task_ids,
      sector_id,
    });

    return plainToClass(UserTasksResponse, { tasks: data }, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':member_id/role')
  @UseGuards(AuthGuard, ChurchRoleGuard)
  @ApiOperation({ summary: 'Definir papel de um membro no setor (admin ou membro)' })
  @ApiParam({ name: 'church_id', description: 'Identificador da igreja', type: String })
  @ApiParam({ name: 'sector_id', description: 'Identificador do setor', type: String })
  @ApiParam({ name: 'member_id', description: 'Identificador do membro', type: String })
  @ApiBody({
    type: UpdateSectorMemberRoleBody,
    description: 'Novo papel do membro dentro do setor',
    examples: {
      default: {
        summary: 'Promover para admin do setor',
        value: {
          role: 'ADMIN',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Papel do membro atualizado com sucesso',
    schema: {
      example: {
        message: 'Member role updated successfully',
      },
    },
  })
  async updateMemberRole(
    @Param('church_id') church_id: UUID,
    @Param('sector_id') sector_id: UUID,
    @Param('member_id') member_id: UUID,
    @Body() body: UpdateSectorMemberRoleBody,
  ): Promise<{ message: string }> {
    await this.ensureSectorBelongsToChurch(church_id, sector_id);
    await this.ensureValidChurchMember(church_id, member_id);

    await this.createUserSector.execute({
      sector_id,
      user_id: member_id,
      role: body.role,
    });

    return { message: 'Member role updated successfully' };
  }

  @Delete(':member_id')
  @UseGuards(AuthGuard, SectorGuard)
  @ApiOperation({ summary: 'Remover um membro do setor' })
  @ApiParam({ name: 'church_id', description: 'Identificador da igreja', type: String })
  @ApiParam({ name: 'sector_id', description: 'Identificador do setor', type: String })
  @ApiParam({ name: 'member_id', description: 'Identificador do membro', type: String })
  @ApiOkResponse({
    description: 'Membro removido do setor com sucesso',
    schema: {
      example: {
        message: 'Member removed from sector successfully',
      },
    },
  })
  async removeMember(
    @Param('church_id') church_id: UUID,
    @Param('sector_id') sector_id: UUID,
    @Param('member_id') member_id: UUID,
  ): Promise<{ message: string }> {
    await this.ensureSectorBelongsToChurch(church_id, sector_id);

    const { data: relation } = await this.getUserSector.execute({ user_id: member_id, sector_id });

    if (!relation) {
      throw new BadRequestException('Member is not part of this sector');
    }

    await this.deleteUserSector.execute({ user_id: member_id, sector_id });

    return { message: 'Member removed from sector successfully' };
  }
}
