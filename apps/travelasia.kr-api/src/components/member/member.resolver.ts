import { Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { WithoutGuard } from '../auth/guards/without.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';

@Resolver()
export class MemberResolver {
  @UseGuards(AuthGuard)
  @Query(() => String)
  me(@AuthMember() authMember: any): string {
    return authMember?.email ?? 'NO_EMAIL';
  }

  @UseGuards(WithoutGuard)
  @Query(() => String)
  whoami(@AuthMember() authMember: any): string {
    return authMember?.email ?? 'GUEST';
  }

  @Query(() => [String])
  members(): string[] {
    return [];
  }
}
