import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from 'typeorm';
import { BaseEntity } from './base';
import { EntityEnum } from '../../enums';
import { Church } from './churches.entity';
import { Task } from './tasks.entity';
import { Scale } from './scales.entity';

@Entity(EntityEnum.SECTOR)
@Unique(['name', 'church_id'])
export class Sector extends BaseEntity {
  @Column({ unique: true })
  name!: string;

  @ManyToOne(() => Church, (church) => church.sectors, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'church_id' })
  church!: Church;

  @Column()
  church_id!: string;

  @OneToMany(() => Task, (task) => task.sector)
  tasks?: Task[];

  @OneToMany(() => Scale, (scale) => scale.sector)
  scales?: Scale[];
}