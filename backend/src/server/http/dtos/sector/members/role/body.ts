import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { SectorRoleEnum } from '../../../../../../enums';

export class UpdateSectorMemberRoleBody {
    @ApiProperty({
        enum: [SectorRoleEnum.ADMIN, SectorRoleEnum.MEMBER],
        example: SectorRoleEnum.ADMIN,
        description: 'Novo papel do membro no setor',
    })
    @IsIn([SectorRoleEnum.ADMIN, SectorRoleEnum.MEMBER])
    role!: SectorRoleEnum.ADMIN | SectorRoleEnum.MEMBER;
}
