import { RoleEnum } from "../../../../enums";

class UserOutput {
    email!: string;
    name!: string;
    role!: RoleEnum
}

export class Output {
    data!: UserOutput | null
}
