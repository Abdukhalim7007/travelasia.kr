import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { MemberType } from '../../../libs/enums/member.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<MemberType[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);
    const authMember = ctx.getContext().req.body?.authMember || ctx.getContext().req.authMember;

    if (!authMember) {
      throw new ForbiddenException('Authentication required');
    }

    const memberType = authMember.memberType;
    if (!requiredRoles.includes(memberType)) {
      throw new ForbiddenException('Insufficient permissions');
    }

    return true;
  }
}

