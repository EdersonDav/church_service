import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { CreateChurch } from '../../../../core/use-cases/church';
import { CreateChurchResponseData, CreateChurchBody } from '../../dtos';

@Controller('churches')
export class ChurchController {
  constructor(
    private readonly createChurch: CreateChurch
  ) { }

  @Post('')
  async task(
    @Body() body: CreateChurchBody
  ): Promise<CreateChurchResponseData> {
    if (!body.name) {
      throw new BadRequestException('Name is necessary');
    }

    const { data } = await this.createChurch.execute(body);

    return data
  }
}


