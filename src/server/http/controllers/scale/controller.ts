import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { UUID } from 'crypto';

import {
  CreateScale,
  DeleteScale,
  GetScale,
  ListScalesBySector,
  SetScaleParticipants,
  UpdateScale,
} from '../../../../core/use-cases/scales';
import { GetSector } from '../../../../core/use-cases/sectors';
import { GetUserSector } from '../../../../core/use-cases/user-sector';
import { GetUserChurch } from '../../../../core/use-cases/user-church';
import { AuthGuard, SectorGuard } from '../../../../core/guards';
import { ReqUserDecorator } from '../../../../common';
import {
  CreateScaleBody,
  CreateScaleResponse,
  GetScaleResponse,
  ListScalesResponse,
  ScaleDto,
  SetScaleParticipantsBody,
  SetScaleParticipantsResponse,
  UpdateScaleBody,
  UpdateScaleResponse,
} from '../../dtos/scales';

@Controller('churches/:church_id/sectors/:sector_id/scales')
export class ScaleController {
  constructor(
    private readonly createScale: CreateScale,
    private readonly updateScale: UpdateScale,
    private readonly deleteScale: DeleteScale,
    private readonly getScale: GetScale,
    private readonly listScalesBySector: ListScalesBySector,
    private readonly setScaleParticipants: SetScaleParticipants,
    private readonly getSector: GetSector,
    private readonly getUserSector: GetUserSector,
    private readonly getUserChurch: GetUserChurch,
  ) { }

  private async ensureSector(church_id: UUID, sector_id: UUID) {
    const { data } = await this.getSector.execute({ search_by: 'id', search_data: sector_id });

    if (!data || data.church?.id !== church_id) {
      throw new BadRequestException('Sector not found for this church');
    }

    return data;
  }

  private async ensureMembership(user_id: UUID, church_id: UUID, sector_id: UUID): Promise<void> {
    const [{ data: churchRelation }, { data: sectorRelation }] = await Promise.all([
      this.getUserChurch.execute({ user_id, church_id }),
      this.getUserSector.execute({ user_id, sector_id }),
    ]);

    if (!churchRelation && !sectorRelation) {
      throw new ForbiddenException('Access denied');
    }
  }

  private toScaleDto(scale: any): ScaleDto {
    const participants = (scale.participants || []).map((participant: any) => ({
      user_id: participant.user_id,
      task_id: participant.task_id,
      user_name: participant.user?.name,
      task_name: participant.task?.name,
    }));

    return plainToClass(ScaleDto, { ...scale, participants }, {
      excludeExtraneousValues: true,
    });
  }

  @Post('')
  @UseGuards(AuthGuard, SectorGuard)
  async create(
    @Param('church_id') church_id: UUID,
    @Param('sector_id') sector_id: UUID,
    @Body() body: CreateScaleBody,
  ): Promise<CreateScaleResponse> {
    await this.ensureSector(church_id, sector_id);

    const date = new Date(body.date);

    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException('Invalid date');
    }

    const { data } = await this.createScale.execute({ sector_id, date });
    const { data: scale } = await this.getScale.execute({ scale_id: data.id });

    return this.toScaleDto(scale || { ...data, participants: [] });
  }

  @Get('')
  @UseGuards(AuthGuard)
  async list(
    @Param('church_id') church_id: UUID,
    @Param('sector_id') sector_id: UUID,
    @ReqUserDecorator() user: { id: UUID },
  ): Promise<ListScalesResponse> {
    await this.ensureSector(church_id, sector_id);
    await this.ensureMembership(user.id, church_id, sector_id);

    const { data } = await this.listScalesBySector.execute({ sector_id });

    const scales = data.map((scale) => this.toScaleDto(scale));

    return plainToClass(ListScalesResponse, { scales }, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':scale_id')
  @UseGuards(AuthGuard)
  async get(
    @Param('church_id') church_id: UUID,
    @Param('sector_id') sector_id: UUID,
    @Param('scale_id') scale_id: UUID,
    @ReqUserDecorator() user: { id: UUID },
  ): Promise<GetScaleResponse> {
    await this.ensureSector(church_id, sector_id);
    await this.ensureMembership(user.id, church_id, sector_id);

    const { data } = await this.getScale.execute({ scale_id });

    if (!data || data.sector_id !== sector_id) {
      throw new BadRequestException('Scale not found');
    }

    return plainToClass(GetScaleResponse, { scale: this.toScaleDto(data) }, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':scale_id')
  @UseGuards(AuthGuard, SectorGuard)
  async update(
    @Param('church_id') church_id: UUID,
    @Param('sector_id') sector_id: UUID,
    @Param('scale_id') scale_id: UUID,
    @Body() body: UpdateScaleBody,
  ): Promise<UpdateScaleResponse> {
    await this.ensureSector(church_id, sector_id);

    const date = body.date ? new Date(body.date) : undefined;

    if (date && Number.isNaN(date.getTime())) {
      throw new BadRequestException('Invalid date');
    }

    await this.updateScale.execute({ scale_id, sector_id, date });
    const { data: fullScale } = await this.getScale.execute({ scale_id });

    if (!fullScale) {
      throw new BadRequestException('Scale not found');
    }

    return this.toScaleDto(fullScale);
  }

  @Patch(':scale_id/participants')
  @UseGuards(AuthGuard, SectorGuard)
  async setParticipants(
    @Param('church_id') church_id: UUID,
    @Param('sector_id') sector_id: UUID,
    @Param('scale_id') scale_id: UUID,
    @Body() body: SetScaleParticipantsBody,
  ): Promise<SetScaleParticipantsResponse> {
    await this.ensureSector(church_id, sector_id);

    await this.setScaleParticipants.execute({
      scale_id,
      sector_id,
      participants: body.participants,
    });

    const { data } = await this.getScale.execute({ scale_id });

    if (!data) {
      throw new BadRequestException('Scale not found');
    }

    return this.toScaleDto(data);
  }

  @Delete(':scale_id')
  @UseGuards(AuthGuard, SectorGuard)
  async delete(
    @Param('church_id') church_id: UUID,
    @Param('sector_id') sector_id: UUID,
    @Param('scale_id') scale_id: UUID,
  ): Promise<{ message: string }> {
    await this.ensureSector(church_id, sector_id);

    const { data } = await this.getScale.execute({ scale_id });

    if (!data || data.sector_id !== sector_id) {
      throw new BadRequestException('Scale not found');
    }

    await this.deleteScale.execute({ scale_id });

    return { message: 'Scale deleted successfully' };
  }
}
