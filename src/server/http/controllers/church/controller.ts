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
// INSERT INTO public.users
// ( id, created_at, updated_at, deleted_at, email, "password", "role", "name")
// VALUES( '29a05584-87aa-4098-b438-a609097dc4e5', now(), now(), null, 'silva.edersonqueiroz@gmail.com', '$2a$10$pf0hCMFMLIA5N68Pw9JHS.TLavrTg42zx0mCuVFNuMXUjkh6WKxi6', 'admin', 'Ederson');


