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

import { CreateUserChurch, GetUserChurchMembers, GetUserChurch } from '../../../../../core/use-cases/user-church';
import { GetNotVerifiedUser, GetUser } from '../../../../../core/use-cases/user';
import {
  BodyMemberDTO,
  ResponseMembersDTO
} from '../../../dtos';
import { AuthGuard, ChurchRoleGuard } from '../../../../../core/guards';
import { UUID } from 'crypto';
import { ChurchRoleEnum } from '../../../../../enums';

@ApiTags('Membros da Igreja')
@ApiBearerAuth()
@Controller('churches/:church_id/members')
export class MembersController {
  constructor(
    private readonly createUserChurch: CreateUserChurch,
    private readonly getUser: GetUser,
    private readonly getNotVerifiedUser: GetNotVerifiedUser,
    private readonly getUserChurchMembers: GetUserChurchMembers,
    private readonly getUserChurch: GetUserChurch
  ) { }

  @Post('')
  @UseGuards(AuthGuard, ChurchRoleGuard)
  @ApiOperation({ summary: 'Adicionar um membro à igreja' })
  @ApiParam({ name: 'church_id', description: 'Identificador da igreja', type: String })
  @ApiBody({
    type: BodyMemberDTO,
    description: 'Identificador do membro que será vinculado à igreja',
    examples: {
      default: {
        summary: 'Vincular membro existente',
        value: {
          member_id: '9dd66e36-9a45-4fcf-8e83-291bdfe7c1b8',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Membro adicionado com sucesso',
    schema: {
      example: {
        message: 'Member added successfully',
      },
    },
  })
  async addMember(
    @Body() body: BodyMemberDTO,
    @Param('church_id') church_id: UUID,
  ): Promise<{ message: string; }> {
    const { data: member } = await this.getUser.execute({ search_data: body.member_id, search_by: 'id' });
    if (!member || !member.email) {
      throw new BadRequestException('Invalid Member');
    }

    const { data: notVerifiedUser } = await this.getNotVerifiedUser.execute({ email: member.email });

    if (notVerifiedUser) {
      throw new BadRequestException('Member is not verified');
    }

    await this.createUserChurch.execute({
      church_id: church_id,
      user_id: body.member_id,
      role: ChurchRoleEnum.VOLUNTARY
    });

    return { message: 'Member added successfully' };
  }

  @Get()
  @UseGuards(AuthGuard, ChurchRoleGuard)
  @ApiOperation({ summary: 'Listar membros cadastrados na igreja' })
  @ApiParam({ name: 'church_id', description: 'Identificador da igreja', type: String })
  @ApiOkResponse({
    description: 'Lista de membros retornada com sucesso',
    schema: {
      example: {
        church: {
          id: 'e8c7a0b9-7a0c-4f1d-8a3e-5f3c1e6b3a1f',
          name: 'Igreja Vida em Cristo',
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
  ): Promise<ResponseMembersDTO> {
    const { data: members } = await this.getUserChurchMembers.execute({ church_id });

    if (!members) {
      throw new BadRequestException('No members found for this church');
    }

    return plainToClass(ResponseMembersDTO, {
      church: members.church,
      members: members.members
    });
  }

  @Post('make_admin/:member_id')
  @UseGuards(AuthGuard, ChurchRoleGuard)
  @ApiOperation({ summary: 'Promover um membro ao papel de administrador' })
  @ApiParam({ name: 'church_id', description: 'Identificador da igreja', type: String })
  @ApiParam({ name: 'member_id', description: 'Identificador do membro', type: String })
  @ApiOkResponse({
    description: 'Membro promovido com sucesso',
    schema: {
      example: {
        message: 'Member promoted to admin successfully',
      },
    },
  })
  async makeAdmin(
    @Param('church_id') church_id: UUID,
    @Param('member_id') member_id: UUID,
  ): Promise<{ message: string }> {
    const { data: member } = await this.getUser.execute({ search_data: member_id, search_by: 'id' });
    if (!member || !member.email) {
      throw new BadRequestException('Invalid Member');
    }

    const { data: isMember } = await this.getUserChurch.execute({ church_id, user_id: member_id });

    if (!isMember) {
      throw new BadRequestException('Invalid Member');
    }

    await this.createUserChurch.execute({
      church_id: church_id,
      user_id: member_id,
      role: ChurchRoleEnum.ADMIN
    });

    return { message: 'Member promoted to admin successfully' };
  }
}