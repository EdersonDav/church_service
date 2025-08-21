import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { GetUserChurch } from "../use-cases/user-church";
import { ChurchRoleEnum, SectorRoleEnum } from "../../enums";
import { GetUserSector } from "../use-cases/user-sector";

@Injectable()
export class SectorGuard implements CanActivate {
    constructor(
        private getUserChurch: GetUserChurch,
        private getUserSector: GetUserSector,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        const userChurch = await this.getUserChurch.execute({
            user_id: user.id, church_id: request.params.church_id
        });

        if (userChurch?.data?.role === ChurchRoleEnum.ADMIN) {
            return true;
        }

        const sector_id = request.params.sector_id;

        const sectorUser = await this.getUserSector.execute({
            user_id: user.id,
            sector_id: sector_id
        });

        if (sectorUser?.data?.role === SectorRoleEnum.LEADER) {
            return true;
        }

        throw new UnauthorizedException('Você não tem acesso a este setor');
    }
}
