import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';

export const GetUser = createParamDecorator((data, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const user = req.user;
  console.log('REQ', req);
  console.log('REQ.USER', req.user);

  if (!user) throw new InternalServerErrorException('Usuario no valido');

  return user;
});
