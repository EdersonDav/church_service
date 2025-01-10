import { Column, Entity, ManyToMany, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from './base';
import { EntityEnum } from '../../enums';
import { Sector } from './sectors.entity';
import { User } from './users.entity';

@Entity(EntityEnum.TASK)
@Unique(['name'])
export class Task extends BaseEntity<Task> {
  @Column({ unique: true })
  name!: string;

  @Column({ nullable: true })
  icon?: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(() => Sector, (sector) => sector.tasks, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  sector!: Sector;

  @ManyToMany(() => User, (user) => user.tasks)
  users!: User[];
}
