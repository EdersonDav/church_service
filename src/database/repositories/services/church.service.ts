import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeORMRepository } from 'typeorm';
import { Church } from '../../entities';
import { ChurchRepository } from '../interfaces';

@Injectable()
export class ChurchService implements ChurchRepository {
  constructor(
    @InjectRepository(Church)
    private readonly entity: TypeORMRepository<Church>
  ) { }

  async save(church: Partial<Church>): Promise<Church> {
    const churchCreated = this.entity.create(church);
    const savedChurch = await this.entity.save(churchCreated);
    return savedChurch;
  }
}
