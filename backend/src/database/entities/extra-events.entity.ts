import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base';
import { EntityEnum } from '../../enums';
import { Church } from './churches.entity';

@Entity(EntityEnum.EXTRA_EVENT)
export class ExtraEvent extends BaseEntity {
  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  type?: string;

  @Column({ type: 'timestamp' })
  date!: Date;

  @Column({ type: 'uuid' })
  church_id!: string;

  @ManyToOne(() => Church, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'church_id' })
  church!: Church;
}
