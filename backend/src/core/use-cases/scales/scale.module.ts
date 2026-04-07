import { Module } from '@nestjs/common';
import { DataBaseModule } from '../../../database';
import { CreateScale } from './create';
import { UpdateScale } from './update';
import { DeleteScale } from './delete';
import { GetScale } from './get';
import { ListScalesBySector } from './list-by-sector';
import { SetScaleParticipants } from './set-participants';
import { ScaleSongModule } from '../scale-songs';

const useCases = [
    CreateScale,
    UpdateScale,
    DeleteScale,
    GetScale,
    ListScalesBySector,
    SetScaleParticipants,
];

@Module({
    imports: [DataBaseModule, ScaleSongModule],
    providers: [...useCases],
    exports: [...useCases],
})
export class ScaleModule { }
