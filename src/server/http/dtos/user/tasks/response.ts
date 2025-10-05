import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { TaskDto } from '../../tasks';

export class UserTasksResponse {
    @Expose()
    @Type(() => TaskDto)
    @ApiProperty({ type: TaskDto, isArray: true })
    tasks!: TaskDto[];
}
