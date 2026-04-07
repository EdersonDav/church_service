import { Church, UserChurch } from "../../../../database/entities";

export class MembersData {
    church!: Partial<Church>;
    members!: Partial<UserChurch>[];
}

export class Output {
    data!: MembersData | null;
}
