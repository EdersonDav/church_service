export type ParticipantInput = {
    user_id: string;
    task_id: string;
};

export class Input {
    scale_id!: string;
    sector_id!: string;
    participants!: ParticipantInput[];
}
