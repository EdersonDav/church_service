import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { BaseEntity } from './base';
import { EntityEnum } from '../../enums';
import { Unavailability } from './unavailability.entity';
import { Participant } from './participants.entity';
import { VerificationCode } from './verification-code.entity';
import { PasswordResetToken } from './password-reset-token.entity';

@Entity(EntityEnum.USER)
@Unique(['email'])
export class User extends BaseEntity {
  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  name!: string;

  @OneToMany(() => Unavailability, (unavailability) => unavailability.user)
  unavailability?: Unavailability[];

  @OneToMany(() => Participant, (participant) => participant.user)
  participants?: Participant[];

  @Column({ default: false })
  is_verified!: boolean;

  @OneToMany(() => VerificationCode, (v) => v.user)
  codes?: VerificationCode[];

  @OneToMany(() => PasswordResetToken, (t) => t.user)
  reset_tokens?: PasswordResetToken[];

  @Column({ type: 'date', nullable: true, default: null })
  birthday?: Date | null;
}
