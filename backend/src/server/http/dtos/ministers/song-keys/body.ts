import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsString, IsUUID, Length, ValidateNested } from 'class-validator';

export class MinisterSongKeyItemBody {
  @ApiProperty({ example: 'f971f727-8861-4d37-b37f-9c48f6172e2f' })
  @IsUUID()
  song_id!: string;

  @ApiProperty({ example: 'A' })
  @IsString()
  @Length(1, 10)
  custom_key!: string;
}

export class SetMySongKeysBody {
  @ApiProperty({ type: [MinisterSongKeyItemBody] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MinisterSongKeyItemBody)
  items!: MinisterSongKeyItemBody[];
}
