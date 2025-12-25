import { Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { WithoutGuard } from '../auth/guards/without.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { Member as MemberDTO } from '../../libs/dto/member/member';
import { MemberService } from './member.service';

@Resolver()
export class MemberResolver {
  constructor(private readonly memberService: MemberService) {}

  @UseGuards(AuthGuard)
  @Query(() => MemberDTO)
  me(@AuthMember() authMember: any): MemberDTO {
    return {
      _id: authMember?._id?.toString() || '',
      email: authMember?.email || '',
      fullName: authMember?.fullName || null,
      memberType: authMember?.memberType || null,
    };
  }

  @UseGuards(WithoutGuard)
  @Query(() => String)
  whoami(@AuthMember() authMember: any): string {
    return authMember?.email ?? 'GUEST';
  }

  @Query(() => [MemberDTO])
  async members(): Promise<MemberDTO[]> {
    return this.memberService.getMembers();
  }

  @Query(() => [MemberDTO])
  async agents(): Promise<MemberDTO[]> {
    return this.memberService.getAgents();
  }
}
