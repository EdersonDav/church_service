import { UUID } from "crypto";

export class Input {
    user_id!: UUID;
    code!: string;
}