import { UUID } from "crypto";
import { ChurchRoleEnum } from "../../../../enums";

export class UserChurchOutput {
    church_id!: UUID;
    user_id!: UUID;
    role!: ChurchRoleEnum;
}

export class Output {
    data!: UserChurchOutput
}
