import { UUID } from "crypto";
import { RoleEnum } from "../../../../enums";

export class UserChurchOutput {
    church_id!: UUID;
    user_id!: UUID;
    role!: RoleEnum;
}

export class Output {
    data!: UserChurchOutput
}
