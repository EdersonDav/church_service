import { Injectable } from '@nestjs/common';
import { Input } from './input';
import { Output } from './output';
import { ChurchRepository } from '../../../../database/repositories/interfaces';

@Injectable()
export class CreateChurch {
  constructor(
    private churchService: ChurchRepository
  ) { }
  async execute(input: Input): Promise<Output> {
    const data = await this.churchService.save(input)
    return {
      data: {
        name: data.name,
        id: data.id,
        description: data.description,
        created_at: data.created_at,
        updated_at: data.updated_at,
      }
    }
  }
}
