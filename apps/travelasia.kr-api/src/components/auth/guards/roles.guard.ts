import { BadRequestException, CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth.service';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext | any): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) return true;

    console.info(`--- @guard() Authentication [RolesGuard]: ${roles} ---`);

    if (context.contextType === 'graphql') {
      const request = context.getArgByIndex(2).req;
      const bearerToken = request.headers.authorization;
      if (!bearerToken) throw new BadRequestException('Bearer Token is not provided!');

      const token = bearerToken.split(' ')[1];
      const authMember = await this.authService.verifyToken(token);
      const hasRole = () => roles.indexOf(authMember.memberType) > -1;
      const hasPermission: boolean = hasRole();

      if (!authMember || !hasPermission) throw new ForbiddenException('Allowed only for members with specific roles!');

      console.log('memberNick[roles] =>', authMember.email || authMember.fullName || 'authorized');
      request.body.authMember = authMember;
      return true;
    }
    return true;
    // description => http, rpc, gprs and etc are ignored
  }
}
