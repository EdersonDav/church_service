import { Sector, UserSector } from "../../../../database/entities";

export class MembersData {
    sector!: Partial<Sector>;
    members!: Partial<UserSector>[];
}

export class Output {
    data!: MembersData | null;
}
