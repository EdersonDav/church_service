import { Module } from '@nestjs/common';
import { DataBaseModule } from '../../../database';
import { CreateUnavailability } from './create';
import { DeleteUnavailability } from './delete';
import { ListUserUnavailability } from './list-by-user';

const useCases = [CreateUnavailability, DeleteUnavailability, ListUserUnavailability];

@Module({
    imports: [DataBaseModule],
    providers: [...useCases],
    exports: [...useCases],
})
export class UnavailabilityModule { }
