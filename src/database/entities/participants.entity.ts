import { Entity, Unique } from 'typeorm';
import { BaseEntity } from './base';
import { EntityEnum } from '../../enums';

@Entity(EntityEnum.PARTICIPANTS)
@Unique(['scale_id', 'user_id', 'task_id'])
export class Participants extends BaseEntity<Participants> {
  //TODO
}
