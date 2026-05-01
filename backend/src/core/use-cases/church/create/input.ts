import { UUID } from "crypto";

export class Input {
    name!: string;
    description?: string;
    user_id!: UUID;
}
