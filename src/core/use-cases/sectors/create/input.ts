import { Church } from "../../../../database/entities";

export class Input {
    name!: string;
    church!: Partial<Church>;
}