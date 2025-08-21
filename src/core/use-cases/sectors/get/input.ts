import { Sector } from "../../../../database/entities";

export class Input<K extends keyof Sector = keyof Sector> {
    search_by!: K;
    search_data!: Sector[K];
}