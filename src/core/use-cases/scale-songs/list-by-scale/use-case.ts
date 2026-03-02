import { Injectable } from '@nestjs/common';
import { ScaleSongRepository } from '../../../../database/repositories/interfaces';
import { UUID } from 'crypto';

@Injectable()
export class ListScaleSongs {
  constructor(
    private readonly scaleSongRepository: ScaleSongRepository,
  ) { }

  async execute(input: {
    scale_id: UUID;
  }) {
    const data = await this.scaleSongRepository.findByScale(input.scale_id);

    return { data };
  }
}
