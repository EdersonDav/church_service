import { Module } from '@nestjs/common';
import { DataBaseModule } from '../../../database';
import { CreateScale } from './create';
import { UpdateScale } from './update';
import { DeleteScale } from './delete';
import { GetScale } from './get';
import { ListScalesBySector } from './list-by-sector';
import { SetScaleParticipants } from './set-participants';

const useCases = [
    CreateScale,
    UpdateScale,
    DeleteScale,
    GetScale,
    ListScalesBySector,
    SetScaleParticipants,
];

@Module({
    imports: [DataBaseModule],
    providers: [...useCases],
    exports: [...useCases],
})
export class ScaleModule { }
