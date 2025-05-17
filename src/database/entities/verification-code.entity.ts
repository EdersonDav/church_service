import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import { User } from "./users.entity";
import { BaseEntity } from "./base";
import { EntityEnum } from "../../enums";

@Entity(EntityEnum.VERIFICATION_CODE)
@Unique('user_code_expires_at', ['user_id', 'code', 'expires_at'])
export class VerificationCode extends BaseEntity{
  @Column()
  code!: string;

  @Column({ type: 'timestamp' })
  expires_at!: Date;

  @ManyToOne(() => User, (user) => user.codes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column()
  user_id!: string;
}