import { UUID } from "crypto";
import { RoleEnum } from "../../../../enums";

export class Input {
    church_id!: UUID;
    user_id!: UUID;
    role!: RoleEnum;
}