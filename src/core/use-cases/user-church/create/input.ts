import { UUID } from "crypto";
import { ChurchRoleEnum } from "../../../../enums";

export class Input {
    church_id!: UUID;
    user_id!: UUID;
    role!: ChurchRoleEnum;
}