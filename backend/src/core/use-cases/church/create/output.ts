import { UUID } from "crypto";

export class ChurchOutput {
    id!: UUID;
    name!: string;
    description?: string;
    created_at?: Date;
    updated_at?: Date;
}

export class Output {
    data!: ChurchOutput
}
