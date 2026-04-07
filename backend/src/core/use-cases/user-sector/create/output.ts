import { UUID } from "crypto";
import { SectorRoleEnum } from "../../../../enums";

export class UserSectorOutput {
    sector_id!: UUID;
    user_id!: UUID;
    role!: SectorRoleEnum;
}

export class Output {
    data!: UserSectorOutput
}
