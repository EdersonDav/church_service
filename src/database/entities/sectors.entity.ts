import { Column, Entity, ManyToOne, OneToMany, Unique } from 'typeorm';
import { BaseEntity } from './base';
import { EntityEnum } from '../../enums';
import { Church } from './churches.entity';
import { Task } from './tasks.entity';
import { Scale } from './scale.entity';

@Entity(EntityEnum.SECTOR)
@Unique(['name'])
export class Sector extends BaseEntity<Sector> {
  @Column({ unique: true })
  name!: string;

  @ManyToOne(() => Church, (church) => church.sectors, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  church!: Church;

  @OneToMany(() => Task, (task) => task.sector)
  tasks!: Task[];

  @OneToMany(() => Scale, (scale) => scale.sector)
  scale!: Scale[];
}