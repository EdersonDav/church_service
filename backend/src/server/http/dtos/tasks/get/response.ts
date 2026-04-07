import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TaskDto } from '../common/task.dto';

export class GetTaskResponse {
    @Expose()
    @Type(() => TaskDto)
    @ApiProperty({ type: TaskDto, nullable: true })
    task!: TaskDto | null;
}
