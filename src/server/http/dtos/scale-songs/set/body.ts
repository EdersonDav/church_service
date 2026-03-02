import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsUUID } from 'class-validator';

export class SetScaleSongsBody {
  @ApiProperty({
    type: [String],
    example: [
      'f971f727-8861-4d37-b37f-9c48f6172e2f',
      '79271a79-f7cd-47cc-a250-f2f2f0377cfd',
    ],
  })
  @IsArray()
  @IsUUID(undefined, { each: true })
  song_ids!: string[];

  @ApiProperty({
    required: false,
    example: '6d377d4a-1665-4f0f-a021-f655a0e050af',
    description: 'Seleciona explicitamente o ministro para aplicar tons personalizados',
  })
  @IsOptional()
  @IsUUID()
  minister_id?: string;
}
