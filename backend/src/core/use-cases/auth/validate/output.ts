import { UUID } from "crypto";

class UserOutput {
    email!: string;
    name!: string;
    is_verified!: boolean;
    id!: UUID;
}

export class Output {
    data!: UserOutput | null
}
