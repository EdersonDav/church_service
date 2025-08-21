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