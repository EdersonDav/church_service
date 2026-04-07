import { Injectable } from '@nestjs/common';
import { MinisterRepository } from '../../../../database/repositories/interfaces';
import { UUID } from 'crypto';

@Injectable()
export class GetMinister {
  constructor(
    private readonly ministerRepository: MinisterRepository,
  ) { }

  async execute(input: {
    minister_id: UUID;
  }) {
    const data = await this.ministerRepository.getById(input.minister_id);

    return { data };
  }
}
