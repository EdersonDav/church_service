import { UUID } from "crypto";
import { User } from "../../../../database/entities";

export class UserUpdateInput {
    id?: UUID;
    name!: string;
    email!: string;
    password!: string;
}

export class Input {
    user_data!: UserUpdateInput;
    update_by!: keyof User;
}