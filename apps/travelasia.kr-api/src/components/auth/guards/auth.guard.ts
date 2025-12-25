import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext | any): Promise<boolean> {
    console.info('--- @guard() Authentication [AuthGuard] ---');

    if (context.contextType === 'graphql') {
      const request = context.getArgByIndex(2).req;

      const bearerToken = request.headers.authorization;
      if (!bearerToken) throw new BadRequestException('Bearer Token is not provided!');

      const token = bearerToken.split(' ')[1];
      const authMember = await this.authService.verifyToken(token);
      if (!authMember) throw new UnauthorizedException('You are not authenticated, Please login first!');

      console.log('memberNick[auth] =>', authMember.email || authMember.fullName || 'authenticated');
      request.body.authMember = authMember;

      return true;
    }
    return true;
    // description => http, rpc, gprs and etc are ignored
  }
}
