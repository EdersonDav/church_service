import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { GetUserChurch } from '../../user-church/get';
import { RoleEnum } from '../../../../enums';

@Injectable()
export class ChurchRoleGuard implements CanActivate {
    constructor(private userChurchService: GetUserChurch) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const churchId = request.params.church_id;

        const { data: relation } = await this.userChurchService.execute({ user_id: user.id, church_id: churchId });

        if (!relation || relation.role === RoleEnum.VOLUNTARY) {
            throw new ForbiddenException();
        }
        request['userChurch'] = relation;

        return true;
    }
}
