import { UUID } from 'crypto';

export class Input {
  event_id!: UUID;
  event_data!: {
    name?: string;
    description?: string;
    type?: string;
    date?: Date;
  };
}
