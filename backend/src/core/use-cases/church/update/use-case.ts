import { Injectable } from '@nestjs/common';
import { Input } from './input';
import { Output } from './output';
import { ChurchRepository } from '../../../../database/repositories/interfaces';
import { removeNullUndefinedFields } from '../../../helpers';

@Injectable()
export class UpdateChurch {
  constructor(
    private churchRepository: ChurchRepository
  ) { }
  async execute({ church_id, church_data }: Input): Promise<Output> {
    const data = await this.churchRepository.update(church_id, removeNullUndefinedFields(church_data));
    if (!data) {
      throw new Error('Error updating church');
    }

    return {
      data
    }
  }
}
