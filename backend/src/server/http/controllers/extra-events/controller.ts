import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
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
  CreateExtraEvent,
  DeleteExtraEvent,
  GetExtraEvent,
  ListExtraEventsByChurch,
  UpdateExtraEvent,
} from '../../../../core/use-cases/extra-events';
import { GetUserChurch } from '../../../../core/use-cases/user-church';
import { AuthGuard, ChurchRoleGuard } from '../../../../core/guards';
import { ReqUserDecorator } from '../../../../common';
import {
  CreateExtraEventBody,
  CreateExtraEventResponse,
  GetExtraEventResponse,
  ListExtraEventsResponse,
  UpdateExtraEventBody,
  UpdateExtraEventResponse,
} from '../../dtos';

@ApiTags('Eventos Extras')
@ApiBearerAuth()
@Controller('churches/:church_id/events')
export class ExtraEventController {
  constructor(
    private readonly createExtraEvent: CreateExtraEvent,
    private readonly listExtraEventsByChurch: ListExtraEventsByChurch,
    private readonly getExtraEvent: GetExtraEvent,
    private readonly updateExtraEvent: UpdateExtraEvent,
    private readonly deleteExtraEvent: DeleteExtraEvent,
    private readonly getUserChurch: GetUserChurch,
  ) { }

  private async ensureMembership(user_id: UUID, church_id: UUID): Promise<void> {
    const { data } = await this.getUserChurch.execute({ user_id, church_id });
    if (!data) {
      throw new ForbiddenException('Access denied');
    }
  }

  private async ensureEventBelongsToChurch(event_id: UUID, church_id: UUID) {
    const { data } = await this.getExtraEvent.execute({ event_id });

    if (!data) {
      throw new NotFoundException('Event not found');
    }

    if (data.church_id !== church_id) {
      throw new BadRequestException('Event does not belong to this church');
    }

    return data;
  }

  @Post('')
  @UseGuards(AuthGuard, ChurchRoleGuard)
  @ApiOperation({ summary: 'Criar evento extra relacionado à igreja' })
  @ApiParam({ name: 'church_id', type: String, description: 'Identificador da igreja' })
  @ApiBody({ type: CreateExtraEventBody })
  @ApiCreatedResponse({
    description: 'Evento criado com sucesso',
    type: CreateExtraEventResponse,
  })
  async create(
    @Param('church_id') church_id: UUID,
    @Body() body: CreateExtraEventBody,
  ): Promise<CreateExtraEventResponse> {
    const date = new Date(body.date);

    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException('Invalid date');
    }

    const { data } = await this.createExtraEvent.execute({
      church_id,
      name: body.name,
      description: body.description,
      type: body.type,
      date,
    });

    return plainToClass(CreateExtraEventResponse, data, {
      excludeExtraneousValues: true,
    });
  }

  @Get('')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Listar eventos extras da igreja' })
  @ApiParam({ name: 'church_id', type: String, description: 'Identificador da igreja' })
  @ApiOkResponse({
    description: 'Eventos listados com sucesso',
    type: ListExtraEventsResponse,
  })
  async list(
    @Param('church_id') church_id: UUID,
    @ReqUserDecorator() user: { id: UUID },
  ): Promise<ListExtraEventsResponse> {
    await this.ensureMembership(user.id, church_id);

    const { data } = await this.listExtraEventsByChurch.execute({ church_id });

    return plainToClass(ListExtraEventsResponse, { events: data }, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':event_id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Consultar evento extra por identificador' })
  @ApiParam({ name: 'church_id', type: String, description: 'Identificador da igreja' })
  @ApiParam({ name: 'event_id', type: String, description: 'Identificador do evento' })
  @ApiOkResponse({
    description: 'Evento encontrado com sucesso',
    type: GetExtraEventResponse,
  })
  async get(
    @Param('church_id') church_id: UUID,
    @Param('event_id') event_id: UUID,
    @ReqUserDecorator() user: { id: UUID },
  ): Promise<GetExtraEventResponse> {
    await this.ensureMembership(user.id, church_id);

    const data = await this.ensureEventBelongsToChurch(event_id, church_id);

    return plainToClass(GetExtraEventResponse, { event: data }, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':event_id')
  @UseGuards(AuthGuard, ChurchRoleGuard)
  @ApiOperation({ summary: 'Atualizar evento extra' })
  @ApiParam({ name: 'church_id', type: String, description: 'Identificador da igreja' })
  @ApiParam({ name: 'event_id', type: String, description: 'Identificador do evento' })
  @ApiBody({ type: UpdateExtraEventBody })
  @ApiOkResponse({
    description: 'Evento atualizado com sucesso',
    type: UpdateExtraEventResponse,
  })
  async update(
    @Param('church_id') church_id: UUID,
    @Param('event_id') event_id: UUID,
    @Body() body: UpdateExtraEventBody,
  ): Promise<UpdateExtraEventResponse> {
    await this.ensureEventBelongsToChurch(event_id, church_id);

    if (!body.name && !body.description && !body.type && !body.date) {
      throw new BadRequestException('No changes provided');
    }

    const date = body.date ? new Date(body.date) : undefined;

    if (date && Number.isNaN(date.getTime())) {
      throw new BadRequestException('Invalid date');
    }

    const { data } = await this.updateExtraEvent.execute({
      event_id,
      event_data: {
        name: body.name,
        description: body.description,
        type: body.type,
        date,
      },
    });

    if (!data) {
      throw new NotFoundException('Event not found');
    }

    return plainToClass(UpdateExtraEventResponse, data, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':event_id')
  @UseGuards(AuthGuard, ChurchRoleGuard)
  @ApiOperation({ summary: 'Excluir evento extra' })
  @ApiParam({ name: 'church_id', type: String, description: 'Identificador da igreja' })
  @ApiParam({ name: 'event_id', type: String, description: 'Identificador do evento' })
  @ApiOkResponse({
    description: 'Evento removido com sucesso',
    schema: {
      example: {
        message: 'Event deleted successfully',
      },
    },
  })
  async delete(
    @Param('church_id') church_id: UUID,
    @Param('event_id') event_id: UUID,
  ): Promise<{ message: string }> {
    await this.ensureEventBelongsToChurch(event_id, church_id);
    await this.deleteExtraEvent.execute({ event_id });

    return { message: 'Event deleted successfully' };
  }
}
