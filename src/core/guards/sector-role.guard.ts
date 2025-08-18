import { CanActivate, Injectable } from "@nestjs/common";

@Injectable()
export class SectorGuard implements CanActivate {
    constructor(
        private userChurchRepo: UserChurchRepository,
        private sectorUserRepo: SectorUserRepository,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user; // já vem do AuthGuard
        const sectorId = request.params.sector_id;

        // Verifica se o usuário é admin da igreja
        const userChurch = await this.userChurchRepo.findOne({
            where: { userId: user.id, churchId: request.params.church_id },
        });

        if (userChurch?.role === ChurchRoleEnum.ADMIN) {
            return true; // admin pode tudo
        }

        // Verifica se o usuário é líder do setor
        const sectorUser = await this.sectorUserRepo.findOne({
            where: { userId: user.id, sectorId },
        });

        if (sectorUser?.role === SectorRoleEnum.LEADER) {
            return true; // líder pode gerenciar o setor
        }

        throw new UnauthorizedException('Você não tem acesso a este setor');
    }
}
