import { Module } from '@nestjs/common';
import { DataBaseModule } from '../../../database';
import { SetUserTasks } from './set';
import { ListUserTasks } from './list';

const useCases = [SetUserTasks, ListUserTasks];

@Module({
    imports: [DataBaseModule],
    providers: [...useCases],
    exports: [...useCases],
})
export class UserTaskModule { }
