import { Module } from '@nestjs/common';
import { DataBaseModule } from '../../../database';
import { CreateSong } from './create';
import { ListSongsByChurch } from './list-by-church';
import { GetSong } from './get';
import { UpdateSong } from './update';
import { DeleteSong } from './delete';

const useCases = [
  CreateSong,
  ListSongsByChurch,
  GetSong,
  UpdateSong,
  DeleteSong,
];

@Module({
  imports: [DataBaseModule],
  providers: [...useCases],
  exports: [...useCases],
})
export class SongModule { }
