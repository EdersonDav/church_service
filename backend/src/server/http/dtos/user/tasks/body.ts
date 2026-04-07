import { IsArray, IsUUID } from 'class-validator';

export class UpdateUserTasksBody {
    @IsArray()
    @IsUUID(undefined, { each: true })
    task_ids!: string[];
}
