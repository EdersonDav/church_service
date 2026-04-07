import { UUID } from "crypto";

export class SectorUpdateInput {
    name?: string;
    description?: string;
}

export class Input {
    sector_data!: SectorUpdateInput;
    sector_id!: UUID;
}