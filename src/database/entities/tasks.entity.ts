import { Column, Entity, ManyToMany, ManyToOne, OneToOne, Unique } from 'typeorm';
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

  @ManyToMany(() => User, (user) => user.tasks)
  users!: User[];

  @OneToOne(() => Participant, (participant) => participant.task)
  participant!: Participant;
}
