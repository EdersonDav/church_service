import { Injectable } from '@nestjs/common';
import { MinisterRepository } from '../../../../database/repositories/interfaces';
import { UUID } from 'crypto';

@Injectable()
export class ListMinistersByChurch {
  constructor(
    private readonly ministerRepository: MinisterRepository,
  ) { }

  async execute(input: {
    church_id: UUID;
  }) {
    const data = await this.ministerRepository.listByChurch(input.church_id);

    return { data };
  }
}
