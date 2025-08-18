import {
    CanActivate,
    ExecutionContext,
    UnauthorizedException,
    Injectable,
} from '@nestjs/common';
import { GetUserChurch } from '../use-cases/user-church/get';
import { ChurchRoleEnum } from '../../enums';

@Injectable()
export class ChurchRoleGuard implements CanActivate {
    constructor(private userChurchService: GetUserChurch) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const churchId = request.params.church_id;

        const { data: relation } = await this.userChurchService.execute({ user_id: user.id, church_id: churchId });

        if (!relation || relation.role === ChurchRoleEnum.VOLUNTARY) {
            throw new UnauthorizedException();
        }
        request['userChurch'] = relation;

        return true;
    }
}
