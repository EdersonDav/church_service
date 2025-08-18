import {
    Entity,
    ManyToOne,
    JoinColumn,
    Column,
    Unique,
} from 'typeorm';
import { User } from './users.entity';
import { Sector } from './sectors.entity';
import { SectorRoleEnum } from '../../enums';
import { BaseEntity } from './base';

@Entity('sector_users')
@Unique(['user', 'sector'])
export class SectorUser extends BaseEntity {
    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @ManyToOne(() => Sector, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'sector_id' })
    sector!: Sector

    @Column({
        type: 'enum',
        enum: SectorRoleEnum,
        default: SectorRoleEnum.MEMBER,
    })
    role!: SectorRoleEnum;
}