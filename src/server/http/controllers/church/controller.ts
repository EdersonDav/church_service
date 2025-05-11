import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { CreateChurch } from '../../../../core/use-cases/church';
import { ChurchResponseData, ChurchBody } from '../../dtos/church';

@Controller('churches')
export class ChurchController {
  constructor(
    private readonly createChurch: CreateChurch
  ) { }

  @Post('')
  async task(
    @Body() body: ChurchBody
  ): Promise<ChurchResponseData> {
    if (!body.name) {
      throw new BadRequestException('Name is necessary');
    }

    const { data } = await this.createChurch.execute(body);

    return data
  }
}


