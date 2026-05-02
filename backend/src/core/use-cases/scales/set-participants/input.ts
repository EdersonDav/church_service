export type ParticipantInput = {
    user_id: string;
    task_id?: string | null;
};

export class Input {
    scale_id!: string;
    sector_id!: string;
    participants!: ParticipantInput[];
}
