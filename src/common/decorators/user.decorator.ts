import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ReqUserDecorator = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);