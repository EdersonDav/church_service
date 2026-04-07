import { UUID } from "crypto";
import { SectorRoleEnum } from "../../../../enums";

export class Input {
    sector_id!: UUID;
    user_id!: UUID;
    role!: SectorRoleEnum;
}