import { Column, Entity, ManyToOne, OneToMany, Unique } from 'typeorm';
import { BaseEntity } from './base';
import { EntityEnum } from '../../enums';
import { Sector } from './sectors.entity';
import { User } from './users.entity';
import { Participant } from './participants.entity';

@Entity(EntityEnum.TASK)
@Unique(['name'])
export class Task extends BaseEntity {
  @Column({ unique: true })
  name!: string;

  @Column({ nullable: true })
  icon?: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  sector_id!: string;

  @ManyToOne(() => Sector, (sector) => sector.tasks, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  sector!: Sector;

  @OneToMany(() => Participant, (participant) => participant.task)
  participants?: Participant[];
}
