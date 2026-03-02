import { UUID } from 'crypto';

export class Input {
  church_id!: UUID;
  name!: string;
  date!: Date;
  description?: string;
  type?: string;
}
