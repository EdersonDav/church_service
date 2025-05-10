import { UUID } from "crypto";

export class ChurchOutput {
    id!: UUID;
    name!: string;
}

export class Output {
    data!: ChurchOutput
}
