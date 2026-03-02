import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Put,
  UseGuards,
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
import { UUID } from 'crypto';
import { AuthGuard, SectorGuard } from '../../../../../core/guards';
import { ReqUserDecorator } from '../../../../../common';
import { GetSector } from '../../../../../core/use-cases/sectors';
import { GetScale } from '../../../../../core/use-cases/scales';
import { GetUserChurch } from '../../../../../core/use-cases/user-church';
import { GetUserSector } from '../../../../../core/use-cases/user-sector';
import { ListScaleSongs, SetScaleSongs } from '../../../../../core/use-cases/scale-songs';
import {
  ListScaleSongsResponse,
  SetScaleSongsBody,
  SetScaleSongsResponse,
} from '../../../dtos';

@ApiTags('Músicas da Escala')
@ApiBearerAuth()
@Controller('churches/:church_id/sectors/:sector_id/scales/:scale_id/songs')
export class ScaleSongController {
  constructor(
    private readonly setScaleSongs: SetScaleSongs,
    private readonly listScaleSongs: ListScaleSongs,
    private readonly getSector: GetSector,
    private readonly getScale: GetScale,
    private readonly getUserChurch: GetUserChurch,
    private readonly getUserSector: GetUserSector,
  ) { }

  private async ensureSector(church_id: UUID, sector_id: UUID): Promise<void> {
    const { data } = await this.getSector.execute({ search_by: 'id', search_data: sector_id });

    if (!data || data.church?.id !== church_id) {
      throw new NotFoundException('Sector not found for this church');
    }
  }

  private async ensureScale(church_id: UUID, sector_id: UUID, scale_id: UUID): Promise<void> {
    await this.ensureSector(church_id, sector_id);

    const { data } = await this.getScale.execute({ scale_id });

    if (!data || data.sector_id !== sector_id || data.sector?.church_id !== church_id) {
      throw new NotFoundException('Scale not found');
    }
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

  private toDto(data: any[]) {
    return data.map((item) => ({
      id: item.id,
      song_id: item.song_id,
      song_title: item.song?.title,
      song_default_key: item.song?.default_key,
      key: item.key,
      minister_id: item.minister_id ?? null,
      minister_name: item.minister?.name ?? null,
    }));
  }

  @Get('')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Listar músicas da escala com tom aplicado' })
  @ApiParam({ name: 'church_id', type: String })
  @ApiParam({ name: 'sector_id', type: String })
  @ApiParam({ name: 'scale_id', type: String })
  @ApiOkResponse({ type: ListScaleSongsResponse })
  async list(
    @Param('church_id') church_id: UUID,
    @Param('sector_id') sector_id: UUID,
    @Param('scale_id') scale_id: UUID,
    @ReqUserDecorator() user: { id: UUID },
  ): Promise<ListScaleSongsResponse> {
    await this.ensureScale(church_id, sector_id, scale_id);
    await this.ensureMembership(user.id, church_id, sector_id);

    const { data } = await this.listScaleSongs.execute({ scale_id });

    return plainToClass(ListScaleSongsResponse, { songs: this.toDto(data) }, {
      excludeExtraneousValues: true,
    });
  }

  @Put('')
  @UseGuards(AuthGuard, SectorGuard)
  @ApiOperation({ summary: 'Definir músicas da escala e aplicar tons automaticamente' })
  @ApiParam({ name: 'church_id', type: String })
  @ApiParam({ name: 'sector_id', type: String })
  @ApiParam({ name: 'scale_id', type: String })
  @ApiBody({ type: SetScaleSongsBody })
  @ApiOkResponse({ type: SetScaleSongsResponse })
  async set(
    @Param('church_id') church_id: UUID,
    @Param('sector_id') sector_id: UUID,
    @Param('scale_id') scale_id: UUID,
    @Body() body: SetScaleSongsBody,
  ): Promise<SetScaleSongsResponse> {
    await this.ensureScale(church_id, sector_id, scale_id);

    if (!Array.isArray(body.song_ids)) {
      throw new BadRequestException('song_ids must be an array');
    }

    const { data } = await this.setScaleSongs.execute({
      church_id,
      sector_id,
      scale_id,
      song_ids: body.song_ids as UUID[],
      minister_id: body.minister_id as UUID | undefined,
    });

    return plainToClass(SetScaleSongsResponse, { songs: this.toDto(data) }, {
      excludeExtraneousValues: true,
    });
  }
}
