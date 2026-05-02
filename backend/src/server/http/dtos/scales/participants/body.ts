import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsUUID, ValidateNested } from 'class-validator';

class ParticipantItem {
    @IsUUID()
    user_id!: string;

    @IsOptional()
    @IsUUID()
    task_id?: string | null;
}

export class SetScaleParticipantsBody {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ParticipantItem)
    participants!: ParticipantItem[];
}
