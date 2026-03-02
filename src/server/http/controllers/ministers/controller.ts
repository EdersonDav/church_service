import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
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
  CreateMinister,
  DeleteMinister,
  GetMinister,
  GetMinisterByUserAndChurch,
  ListMinistersByChurch,
} from '../../../../core/use-cases/ministers';
import { GetUser } from '../../../../core/use-cases/user';
import { GetChurch } from '../../../../core/use-cases/church';
import { GetUserChurch } from '../../../../core/use-cases/user-church';
import {
  ListMinisterSongKeys,
  SetMinisterSongKeys,
} from '../../../../core/use-cases/minister-song-keys';
import { AuthGuard, ChurchRoleGuard } from '../../../../core/guards';
import { ReqUserDecorator } from '../../../../common';
import {
  CreateMinisterBody,
  CreateMinisterResponse,
  ListMinistersResponse,
  MySongKeysResponse,
  SetMySongKeysBody,
} from '../../dtos';

@ApiTags('Ministros')
@ApiBearerAuth()
@Controller('churches/:church_id/ministers')
export class MinisterController {
  constructor(
    private readonly createMinister: CreateMinister,
    private readonly deleteMinister: DeleteMinister,
    private readonly getMinister: GetMinister,
    private readonly listMinistersByChurch: ListMinistersByChurch,
    private readonly getMinisterByUserAndChurch: GetMinisterByUserAndChurch,
    private readonly getUser: GetUser,
    private readonly getChurch: GetChurch,
    private readonly getUserChurch: GetUserChurch,
    private readonly setMinisterSongKeys: SetMinisterSongKeys,
    private readonly listMinisterSongKeys: ListMinisterSongKeys,
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

  @Post('')
  @UseGuards(AuthGuard, ChurchRoleGuard)
  @ApiOperation({ summary: 'Registrar usuário como ministro na igreja' })
  @ApiParam({ name: 'church_id', type: String })
  @ApiBody({ type: CreateMinisterBody })
  @ApiCreatedResponse({ type: CreateMinisterResponse })
  async create(
    @Param('church_id') church_id: UUID,
    @Body() body: CreateMinisterBody,
  ): Promise<CreateMinisterResponse> {
    await this.ensureChurch(church_id);

    const [{ data: user }, { data: userChurch }, { data: existingMinister }] = await Promise.all([
      this.getUser.execute({ search_by: 'id', search_data: body.user_id as UUID }),
      this.getUserChurch.execute({ user_id: body.user_id as UUID, church_id }),
      this.getMinisterByUserAndChurch.execute({ user_id: body.user_id as UUID, church_id }),
    ]);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!userChurch) {
      throw new BadRequestException('User is not a member of this church');
    }

    if (existingMinister) {
      throw new BadRequestException('User is already registered as minister');
    }

    const { data } = await this.createMinister.execute({
      church_id,
      user_id: body.user_id as UUID,
      name: body.name || user.name || 'Minister',
    });

    return plainToClass(CreateMinisterResponse, {
      ...data,
      user_name: user.name,
    }, {
      excludeExtraneousValues: true,
    });
  }

  @Get('')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Listar ministros da igreja' })
  @ApiParam({ name: 'church_id', type: String })
  @ApiOkResponse({ type: ListMinistersResponse })
  async list(
    @Param('church_id') church_id: UUID,
    @ReqUserDecorator() user: { id: UUID },
  ): Promise<ListMinistersResponse> {
    await this.ensureChurch(church_id);
    await this.ensureMembership(user.id, church_id);

    const { data } = await this.listMinistersByChurch.execute({ church_id });

    const ministers = data.map((minister) => ({
      ...minister,
      user_name: minister.user?.name,
    }));

    return plainToClass(ListMinistersResponse, { ministers }, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':minister_id')
  @UseGuards(AuthGuard, ChurchRoleGuard)
  @ApiOperation({ summary: 'Remover ministro da igreja' })
  @ApiParam({ name: 'church_id', type: String })
  @ApiParam({ name: 'minister_id', type: String })
  @ApiOkResponse({
    schema: {
      example: {
        message: 'Minister deleted successfully',
      },
    },
  })
  async delete(
    @Param('church_id') church_id: UUID,
    @Param('minister_id') minister_id: UUID,
  ): Promise<{ message: string }> {
    await this.ensureChurch(church_id);

    const { data: target } = await this.getMinister.execute({ minister_id });

    if (!target || target.church_id !== church_id) {
      throw new NotFoundException('Minister not found');
    }

    await this.deleteMinister.execute({ minister_id });

    return { message: 'Minister deleted successfully' };
  }

  @Get('me/song-keys')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Listar meus tons personalizados' })
  @ApiParam({ name: 'church_id', type: String })
  @ApiOkResponse({ type: MySongKeysResponse })
  async listMySongKeys(
    @Param('church_id') church_id: UUID,
    @ReqUserDecorator() user: { id: UUID },
  ): Promise<MySongKeysResponse> {
    await this.ensureChurch(church_id);
    await this.ensureMembership(user.id, church_id);

    const { data: minister } = await this.getMinisterByUserAndChurch.execute({
      user_id: user.id,
      church_id,
    });

    if (!minister) {
      throw new NotFoundException('User is not registered as minister in this church');
    }

    const { data } = await this.listMinisterSongKeys.execute({ minister_id: minister.id });

    const keys = data.map((item) => ({
      song_id: item.song_id,
      song_title: item.song?.title,
      song_default_key: item.song?.default_key,
      custom_key: item.custom_key,
    }));

    return plainToClass(MySongKeysResponse, { keys }, {
      excludeExtraneousValues: true,
    });
  }

  @Put('me/song-keys')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Definir meus tons personalizados por música' })
  @ApiParam({ name: 'church_id', type: String })
  @ApiBody({ type: SetMySongKeysBody })
  @ApiOkResponse({ type: MySongKeysResponse })
  async setMySongKeys(
    @Param('church_id') church_id: UUID,
    @Body() body: SetMySongKeysBody,
    @ReqUserDecorator() user: { id: UUID },
  ): Promise<MySongKeysResponse> {
    await this.ensureChurch(church_id);
    await this.ensureMembership(user.id, church_id);

    const { data: minister } = await this.getMinisterByUserAndChurch.execute({
      user_id: user.id,
      church_id,
    });

    if (!minister) {
      throw new NotFoundException('User is not registered as minister in this church');
    }

    const { data } = await this.setMinisterSongKeys.execute({
      church_id,
      minister_id: minister.id,
      items: body.items.map((item) => ({
        song_id: item.song_id as UUID,
        custom_key: item.custom_key,
      })),
    });

    const keys = data.map((item) => ({
      song_id: item.song_id,
      song_title: item.song?.title,
      song_default_key: item.song?.default_key,
      custom_key: item.custom_key,
    }));

    return plainToClass(MySongKeysResponse, { keys }, {
      excludeExtraneousValues: true,
    });
  }
}
