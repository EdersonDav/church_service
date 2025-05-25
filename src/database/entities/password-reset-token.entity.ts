import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import { User } from "./users.entity";
import { BaseEntity } from "./base";
import { EntityEnum } from "../../enums";

@Entity(EntityEnum.PASSWORD_RESET_TOKEN)
@Unique(['user_id', 'token'])
export class PasswordResetToken extends BaseEntity {
  @Column()
  token!: string;

  @Column({ type: 'timestamp' })
  expires_at!: Date;

  @ManyToOne(() => User, (user) => user.reset_tokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column()
  user_id!: string;
}