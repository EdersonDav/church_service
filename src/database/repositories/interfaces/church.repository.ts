import { Church } from '../../entities/churches.entity';

export abstract class ChurchRepository {
  abstract save(church: Partial<Church>): Promise<Church>;
}
