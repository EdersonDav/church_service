import { UUID } from "crypto";
import { RoleEnum } from "../../../../enums";
import { UserChurch } from "../../../../database/entities";

export class Output {
    data!: UserChurch | null;
}
