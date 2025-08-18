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

  @Patch(':church_id')
  @UseGuards(AuthGuard, ChurchRoleGuard)
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