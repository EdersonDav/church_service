import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TaskDto } from '../common/task.dto';

export class ListTasksResponse {
    @Expose()
    @Type(() => TaskDto)
    @ApiProperty({ type: TaskDto, isArray: true })
    tasks!: TaskDto[];
}
