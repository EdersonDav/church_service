import { ScaleStatusEnum } from '../../../../enums';

export class Input {
    sector_id!: string;
    title!: string;
    description?: string;
    status?: ScaleStatusEnum;
    date!: Date;
}
