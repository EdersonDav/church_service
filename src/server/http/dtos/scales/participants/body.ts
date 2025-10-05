import { Type } from 'class-transformer';
import { IsArray, IsUUID, ValidateNested } from 'class-validator';

class ParticipantItem {
    @IsUUID()
    user_id!: string;

    @IsUUID()
    task_id!: string;
}

export class SetScaleParticipantsBody {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => ParticipantItem)
    participants!: ParticipantItem[];
}
