import { Column, Entity, ManyToOne, OneToMany, Unique } from 'typeorm';
import { BaseEntity } from './base';
import { EntityEnum } from '../../enums';
import { Church } from './churches.entity';
import { Task } from './tasks.entity';
import { Scale } from './scales.entity';

@Entity(EntityEnum.SECTOR)
@Unique(['name'])
export class Sector extends BaseEntity<Sector> {
  @Column({ unique: true })
  name!: string;

  @Column()
  church_id!: string;

  @ManyToOne(() => Church, (church) => church.sectors, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  church!: Church;

  @OneToMany(() => Task, (task) => task.sector)
  tasks!: Task[];

  @OneToMany(() => Scale, (scale) => scale.sector)
  scales!: Scale[];
}