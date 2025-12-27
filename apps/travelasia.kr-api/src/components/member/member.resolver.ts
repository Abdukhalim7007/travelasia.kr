import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { WithoutGuard } from '../auth/guards/without.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { Member as MemberDTO } from '../../libs/dto/member/member';
import { MemberService } from './member.service';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { MemberUpdate } from '../../libs/dto/member/member.update';
import { MembersInquiry } from '../../libs/dto/member/members.inquiry';
import { MembersResponse } from '../../libs/dto/member/members.response';

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
      avatar: authMember?.avatar || null,
    };
  }

  @UseGuards(WithoutGuard)
  @Query(() => String)
  whoami(@AuthMember() authMember: any): string {
    return authMember?.email ?? 'GUEST';
  }

  @Query(() => MembersResponse)
  async members(@Args('input', { nullable: true }) input: MembersInquiry): Promise<MembersResponse> {
    return this.memberService.getMembers(input ?? ({} as any));
  }

  @Query(() => [MemberDTO])
  async membersLegacy(): Promise<MemberDTO[]> {
    return this.memberService.getMembersLegacy();
  }

  @Query(() => [MemberDTO])
  async agents(): Promise<MemberDTO[]> {
    return this.memberService.getAgents();
  }

  @UseGuards(AuthGuard)
  @Mutation(() => MemberDTO)
  async updateMemberAvatar(
    @Args({ name: 'file', type: () => GraphQLUpload }) file: FileUpload,
    @AuthMember('_id') memberId: string,
  ): Promise<MemberDTO> {
    return this.memberService.updateMemberAvatar(memberId, file);
  }

  @Roles(MemberType.ADMIN)
  @UseGuards(RolesGuard)
  @Query(() => [MemberDTO])
  async getAllMembersByAdmin(): Promise<MemberDTO[]> {
    return this.memberService.getAllMembersByAdmin();
  }

  @Roles(MemberType.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation(() => MemberDTO)
  async updateMemberByAdmin(
    @Args('memberId') memberId: string,
    @Args('input') input: MemberUpdate,
  ): Promise<MemberDTO> {
    return this.memberService.updateMemberByAdmin(memberId, input);
  }
}
