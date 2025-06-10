import {
  Body,
  Controller,
  Post,
  BadRequestException,
  UseGuards,
  Param,
  Get,
  NotFoundException,
  Delete
} from '@nestjs/common';
import { CreateChurch, DeleteChurch } from '../../../../core/use-cases/church';
import { CreateUserChurch, GetUserChurch } from '../../../../core/use-cases/user-church';
import { CreateChurchResponseData, CreateChurchBody, GetChurchUserResponse } from '../../dtos';
import { AuthGuard, ChurchRoleGuard } from '../../../../core/use-cases/auth/guards';
import { UUID } from 'crypto';
import { ReqUserDecorator } from '../../../../common';
import { RoleEnum } from '../../../../enums';
import { plainToClass } from 'class-transformer';

@Controller('churches')
export class ChurchController {
  constructor(
    private readonly createChurch: CreateChurch,
    private readonly createUserChurch: CreateUserChurch,
    private readonly getUserChurch: GetUserChurch,
    private readonly deleteChurch: DeleteChurch
  ) { }

  @Post('')
  @UseGuards(AuthGuard)
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

    await this.createUserChurch.execute({
      church_id: data.id,
      user_id: user.id,
      role: RoleEnum.ADMIN
    });

    return data
  }

  @Get(':church_id')
  @UseGuards(AuthGuard)
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
  async delete(
    @Param('church_id') church_id: UUID,
  ): Promise<{ message: string }> {
    await this.deleteChurch.execute({
      church_id
    });

    return { message: 'Church deleted successfully' };
  }
}