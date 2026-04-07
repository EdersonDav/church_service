import {
    Entity,
    ManyToOne,
    JoinColumn,
    Column,
    Unique,
} from 'typeorm';
import { User } from './users.entity';
import { Sector } from './sectors.entity';
import { EntityEnum, SectorRoleEnum } from '../../enums';
import { BaseEntity } from './base';
import { UUID } from 'crypto';

@Entity(EntityEnum.USER_SECTOR)
@Unique(['user', 'sector'])
export class UserSector extends BaseEntity {
    @Column({ type: 'uuid' })
    user_id!: UUID;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user!: User;

    @Column({ type: 'uuid' })
    sector_id!: UUID;

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