import { ScaleStatusEnum } from '../../../../enums';

export class Input {
    scale_id!: string;
    sector_id!: string;
    title?: string;
    description?: string;
    status?: ScaleStatusEnum;
    date?: Date;
}
