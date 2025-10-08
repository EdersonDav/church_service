import {
  Body,
  Controller,
  Post,
  UseGuards,
  Param,
  BadRequestException,
  Get,
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

import { CreateUserSector, GetUserSectorMembers } from '../../../../../core/use-cases/user-sector';
import { GetNotVerifiedUser, GetUser } from '../../../../../core/use-cases/user';
import { BodyMemberDTO, ResponseSectorMembersDTO } from '../../../dtos';
import { AuthGuard, SectorGuard } from '../../../../../core/guards';
import { UUID } from 'crypto';
import { SectorRoleEnum } from '../../../../../enums';
import { GetUserChurch } from '../../../../../core/use-cases/user-church';
import { GetSector } from '../../../../../core/use-cases/sectors/get';

@ApiTags('Membros do Setor')
@ApiBearerAuth()
@Controller('churches/:church_id/sectors/:sector_id/members')
export class SectorMembersController {
  constructor(
    private readonly createUserSector: CreateUserSector,
    private readonly getUser: GetUser,
    private readonly getNotVerifiedUser: GetNotVerifiedUser,
    private readonly getUserSectorMembers: GetUserSectorMembers,
    private readonly getUserChurch: GetUserChurch,
    private readonly getSector: GetSector,
  ) { }

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
    const { data: sector } = await this.getSector.execute({ search_by: 'id', search_data: sector_id });

    if (!sector) {
      throw new BadRequestException('Sector not found');
    }

    if (sector.church?.id && sector.church.id !== church_id) {
      throw new BadRequestException('Sector does not belong to this church');
    }

    const { data: member } = await this.getUser.execute({ search_data: body.member_id, search_by: 'id' });
    if (!member || !member.email) {
      throw new BadRequestException('Invalid Member');
    }

    const { data: notVerifiedUser } = await this.getNotVerifiedUser.execute({ email: member.email });

    if (notVerifiedUser) {
      throw new BadRequestException('Member is not verified');
    }

    const { data: churchMember } = await this.getUserChurch.execute({ church_id, user_id: body.member_id });

    if (!churchMember) {
      throw new BadRequestException('Member is not part of this church');
    }

    await this.createUserSector.execute({
      sector_id,
      user_id: body.member_id,
      role: SectorRoleEnum.MEMBER,
    });

    return { message: 'Member added to sector successfully' };
  }

  @Get()
  @UseGuards(AuthGuard, SectorGuard)
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
  ): Promise<ResponseSectorMembersDTO> {
    const { data: sector } = await this.getSector.execute({ search_by: 'id', search_data: sector_id });

    if (!sector) {
      throw new BadRequestException('Sector not found');
    }

    if (sector.church?.id && sector.church.id !== church_id) {
      throw new BadRequestException('Sector does not belong to this church');
    }

    const { data: members } = await this.getUserSectorMembers.execute({ sector_id });

    return plainToClass(ResponseSectorMembersDTO, {
      sector,
      members: members?.members ?? [],
    });
  }
}
