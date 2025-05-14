import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import { User } from "./users.entity";
import { BaseEntity } from "./base";

@Entity()
@Unique('user_code_expires_at', ['user', 'code', 'expires_at'])
export class VerificationCode extends BaseEntity{
  @Column()
  code!: string;

  @Column({ type: 'timestamp' })
  expires_at!: Date;

  @ManyToOne(() => User, (user) => user.codes, { onDelete: 'CASCADE' })
  user!: User;

  @Column()
  user_id!: string;
}