export class TaskOutput {
    id!: string;
    name!: string;
    icon?: string;
    description?: string;
    sector_id!: string;
}

export class Output {
    data!: TaskOutput
}
