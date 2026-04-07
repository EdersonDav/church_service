import { Church } from "../../../../database/entities";

export class Input<K extends keyof Church = keyof Church> {
    search_by!: K;
    search_data!: Church[K];
}