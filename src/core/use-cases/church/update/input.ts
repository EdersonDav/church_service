import { UUID } from "crypto";

export class ChurchUpdateInput {
    name?: string;
    description?: string;
}

export class Input {
    church_data!: ChurchUpdateInput;
    church_id!: UUID;
}