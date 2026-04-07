import { IsString, IsUUID } from "class-validator";
import { UUID } from "crypto";

export class BodyMemberDTO {
    @IsString({ message: 'The member id is needed' })
    @IsUUID(undefined, { message: 'The member id must be a valid UUID' })
    member_id!: UUID;
}