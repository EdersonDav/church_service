import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
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
import { UUID } from 'crypto';
import {
  CreateSong,
  DeleteSong,
  GetSong,
  ListSongsByChurch,
  UpdateSong,
} from '../../../../core/use-cases/songs';
import { GetChurch } from '../../../../core/use-cases/church';
import { GetUserChurch } from '../../../../core/use-cases/user-church';
import { AuthGuard, ChurchRoleGuard } from '../../../../core/guards';
import { ReqUserDecorator } from '../../../../common';
import {
  CreateSongBody,
  CreateSongResponse,
  GetSongResponse,
  ListSongsResponse,
  UpdateSongBody,
  UpdateSongResponse,
} from '../../dtos';

@ApiTags('Músicas')
@ApiBearerAuth()
@Controller('churches/:church_id/songs')
export class SongController {
  constructor(
    private readonly createSong: CreateSong,
    private readonly listSongsByChurch: ListSongsByChurch,
    private readonly getSong: GetSong,
    private readonly updateSong: UpdateSong,
    private readonly deleteSong: DeleteSong,
    private readonly getChurch: GetChurch,
    private readonly getUserChurch: GetUserChurch,
  ) { }

  private async ensureChurch(church_id: UUID): Promise<void> {
    const { data } = await this.getChurch.execute({ search_by: 'id', search_data: church_id });

    if (!data) {
      throw new NotFoundException('Church not found');
    }
  }

  private async ensureMembership(user_id: UUID, church_id: UUID): Promise<void> {
    const { data } = await this.getUserChurch.execute({ user_id, church_id });

    if (!data) {
      throw new ForbiddenException('Access denied');
    }
  }

  private async ensureSongInChurch(song_id: UUID, church_id: UUID) {
    const { data } = await this.getSong.execute({ song_id });

    if (!data || data.church_id !== church_id) {
      throw new NotFoundException('Song not found');
    }

    return data;
  }

  @Post('')
  @UseGuards(AuthGuard, ChurchRoleGuard)
  @ApiOperation({ summary: 'Criar música da igreja' })
  @ApiParam({ name: 'church_id', type: String })
  @ApiBody({ type: CreateSongBody })
  @ApiCreatedResponse({ type: CreateSongResponse })
  async create(
    @Param('church_id') church_id: UUID,
    @Body() body: CreateSongBody,
  ): Promise<CreateSongResponse> {
    await this.ensureChurch(church_id);

    const { data } = await this.createSong.execute({
      church_id,
      title: body.title,
      default_key: body.default_key,
    });

    return plainToClass(CreateSongResponse, data, {
      excludeExtraneousValues: true,
    });
  }

  @Get('')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Listar músicas da igreja' })
  @ApiParam({ name: 'church_id', type: String })
  @ApiOkResponse({ type: ListSongsResponse })
  async list(
    @Param('church_id') church_id: UUID,
    @ReqUserDecorator() user: { id: UUID },
  ): Promise<ListSongsResponse> {
    await this.ensureChurch(church_id);
    await this.ensureMembership(user.id, church_id);

    const { data } = await this.listSongsByChurch.execute({ church_id });

    return plainToClass(ListSongsResponse, { songs: data }, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':song_id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Buscar música por id' })
  @ApiParam({ name: 'church_id', type: String })
  @ApiParam({ name: 'song_id', type: String })
  @ApiOkResponse({ type: GetSongResponse })
  async get(
    @Param('church_id') church_id: UUID,
    @Param('song_id') song_id: UUID,
    @ReqUserDecorator() user: { id: UUID },
  ): Promise<GetSongResponse> {
    await this.ensureChurch(church_id);
    await this.ensureMembership(user.id, church_id);

    const song = await this.ensureSongInChurch(song_id, church_id);

    return plainToClass(GetSongResponse, { song }, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':song_id')
  @UseGuards(AuthGuard, ChurchRoleGuard)
  @ApiOperation({ summary: 'Atualizar música da igreja' })
  @ApiParam({ name: 'church_id', type: String })
  @ApiParam({ name: 'song_id', type: String })
  @ApiBody({ type: UpdateSongBody })
  @ApiOkResponse({ type: UpdateSongResponse })
  async update(
    @Param('church_id') church_id: UUID,
    @Param('song_id') song_id: UUID,
    @Body() body: UpdateSongBody,
  ): Promise<UpdateSongResponse> {
    await this.ensureChurch(church_id);
    await this.ensureSongInChurch(song_id, church_id);

    if (!body.title && !body.default_key) {
      throw new BadRequestException('No changes provided');
    }

    const { data } = await this.updateSong.execute({
      song_id,
      song_data: {
        title: body.title,
        default_key: body.default_key,
      },
    });

    if (!data) {
      throw new NotFoundException('Song not found');
    }

    return plainToClass(UpdateSongResponse, data, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':song_id')
  @UseGuards(AuthGuard, ChurchRoleGuard)
  @ApiOperation({ summary: 'Remover música da igreja' })
  @ApiParam({ name: 'church_id', type: String })
  @ApiParam({ name: 'song_id', type: String })
  @ApiOkResponse({
    schema: {
      example: {
        message: 'Song deleted successfully',
      },
    },
  })
  async delete(
    @Param('church_id') church_id: UUID,
    @Param('song_id') song_id: UUID,
  ): Promise<{ message: string }> {
    await this.ensureChurch(church_id);
    await this.ensureSongInChurch(song_id, church_id);

    await this.deleteSong.execute({ song_id });

    return { message: 'Song deleted successfully' };
  }
}
