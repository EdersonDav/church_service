import { BaseRepository } from './base/base.repository';
import { Sector, User, UserSector } from '../../entities';

export abstract class UserSectorRepository extends BaseRepository<UserSector> {
    abstract getByUserAndSector(user_id: string, sector_id: string): Promise<UserSector | null>;
    abstract getSectorMembers(sector_id: string): Promise<{ sector: Partial<Sector>; members: Partial<User>[] }>;
    abstract deleteByUserAndSector(user_id: string, sector_id: string): Promise<void>;
    abstract deleteByUserAndChurch(user_id: string, church_id: string): Promise<void>;
}
