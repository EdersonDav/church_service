import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeORMRepository } from 'typeorm';
import { Participant } from '../../entities';
import { ParticipantRepository } from '../interfaces';

@Injectable()
export class ParticipantService implements ParticipantRepository {
  constructor(
    @InjectRepository(Participant)
    private readonly entity: TypeORMRepository<Participant>
  ) { }

  async save(participant: Partial<Participant>): Promise<Participant> {
    const created = this.entity.create(participant);
    return this.entity.save(created);
  }

  async delete(id: string): Promise<void> {
    await this.entity.delete(id);
  }

  async findByScale(scale_id: string): Promise<Participant[]> {
    return this.entity.find({
      where: { scale_id },
      relations: {
        task: true,
        user: true,
        scale: true,
      },
    });
  }

  async findByUserAndDate(user_id: string, date: Date): Promise<Participant[]> {
    const dateOnly = this.toDateOnly(date);

    return this.entity
      .createQueryBuilder('participant')
      .innerJoinAndSelect('participant.scale', 'scale')
      .leftJoinAndSelect('scale.sector', 'sector')
      .leftJoinAndSelect('participant.task', 'task')
      .leftJoinAndSelect('participant.user', 'user')
      .where('participant.user_id = :user_id', { user_id })
      .andWhere('DATE(scale.date) = :dateOnly', { dateOnly })
      .getMany();
  }

  async findByUserAndRange(user_id: string, start_date: Date, end_date: Date): Promise<Participant[]> {
    return this.entity
      .createQueryBuilder('participant')
      .innerJoinAndSelect('participant.scale', 'scale')
      .leftJoinAndSelect('scale.sector', 'sector')
      .leftJoinAndSelect('participant.task', 'task')
      .leftJoinAndSelect('participant.user', 'user')
      .where('participant.user_id = :user_id', { user_id })
      .andWhere('scale.date BETWEEN :start_date AND :end_date', { start_date, end_date })
      .getMany();
  }

  private toDateOnly(date: Date): string {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }

    return date.toISOString().slice(0, 10);
  }
}
