import { UUID } from "crypto";
import { User } from "../../../../database/entities";

export class UserUpdateInput {
    id?: UUID;
    name?: string;
    password?: string;
    birthday?: Date | null;
}

export class Input {
    user_data!: UserUpdateInput;
    update_by!: keyof User;
}