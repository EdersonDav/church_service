import {
  Body,
  Controller,
  Post,
  UseGuards,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { CreateUserChurch } from '../../../../../core/use-cases/user-church';
import { GetNotVerifiedUser, GetUser } from '../../../../../core/use-cases/user';
import {
  BodyMemberDTO,
  ResponseMembersDTO
} from '../../../dtos';
import { AuthGuard, ChurchRoleGuard } from '../../../../../core/use-cases/auth/guards';
import { UUID } from 'crypto';
import { RoleEnum } from '../../../../../enums';

@Controller('churches/:church_id/members')
export class MembersController {
  constructor(
    private readonly createUserChurch: CreateUserChurch,
    private readonly getUser: GetUser,
    private readonly getNotVerifiedUser: GetNotVerifiedUser,
  ) { }

  @Post('')
  @UseGuards(AuthGuard, ChurchRoleGuard)
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
      role: RoleEnum.VOLUNTARY
    });

    return { message: 'Member added successfully' };
  }
}