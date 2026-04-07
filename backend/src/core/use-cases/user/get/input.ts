import { User } from "../../../../database/entities";

export class Input<K extends keyof User = keyof User> {
    search_by!: K;
    search_data!: User[K];
}