import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeORMRepository } from 'typeorm';
import { Church } from '../../entities';
import { ChurchRepository } from '../interfaces';
import { UUID } from 'crypto';

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

  async delete(id: string): Promise<void> {
    await this.entity.delete(id);
  }

  async update(church_id: UUID, church_set: Partial<Church>): Promise<Church | null> {
    const church = await this.entity.findOneBy({ id: church_id });
    if (!church) {
      return null;
    }
    Object.assign(church, church_set);
    return this.entity.save(church);
  }
}
