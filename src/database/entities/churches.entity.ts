import { Column, Entity, ManyToOne, OneToMany, Unique } from 'typeorm';
import { BaseEntity } from './base';
import { EntityEnum } from '../../enums';
import { Sector } from './sectors.entity';
import { User } from './users.entity';

@Entity(EntityEnum.CHURCH)
@Unique(['name'])
export class Church extends BaseEntity {
  @Column({ unique: true })
  name!: string;

  @ManyToOne(() => User, (user) => user.churches, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  user!: User;

  @OneToMany(() => Sector, (sector) => sector.church)
  sectors?: Sector[];
}
