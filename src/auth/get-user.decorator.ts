import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from './user.entity';

export interface RequestWithUser extends Request {
  user: User;
}

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
