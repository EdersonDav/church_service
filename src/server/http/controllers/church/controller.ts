import { Body, Controller, Post, BadRequestException, UseGuards } from '@nestjs/common';
import { CreateChurch } from '../../../../core/use-cases/church';
import { CreateUserChurch } from '../../../../core/use-cases/user-church';
import { CreateChurchResponseData, CreateChurchBody } from '../../dtos';
import { AuthGuard } from '../../../../core/use-cases/auth/guards';
import { UUID } from 'crypto';
import { ReqUserDecorator } from '../../../../common';
import { RoleEnum } from '../../../../enums';

@Controller('churches')
export class ChurchController {
  constructor(
    private readonly createChurch: CreateChurch,
    private readonly createUserChurch: CreateUserChurch
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
}


