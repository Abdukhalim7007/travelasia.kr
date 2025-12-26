import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { FollowService } from './follow.service';
import { Follow as FollowDTO } from '../../libs/dto/follow/follow';
import { FollowInput } from '../../libs/dto/follow/follow.input';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';

@Resolver()
export class FollowResolver {
  constructor(private readonly followService: FollowService) {}

  @Query(() => [FollowDTO])
  async followers(@Args('memberId') memberId: string): Promise<FollowDTO[]> {
    return this.followService.getFollowers(memberId);
  }

  @Query(() => [FollowDTO])
  async following(@Args('memberId') memberId: string): Promise<FollowDTO[]> {
    return this.followService.getFollowing(memberId);
  }

  @UseGuards(AuthGuard)
  @Query(() => [FollowDTO])
  async myFollowers(@AuthMember('_id') myId: string): Promise<FollowDTO[]> {
    return this.followService.getFollowers(myId);
  }

  @UseGuards(AuthGuard)
  @Query(() => [FollowDTO])
  async myFollowing(@AuthMember('_id') myId: string): Promise<FollowDTO[]> {
    return this.followService.getFollowing(myId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => FollowDTO)
  async follow(
    @Args('input') input: FollowInput,
    @AuthMember('_id') myId: string,
  ): Promise<FollowDTO> {
    return this.followService.followMember(myId, input.targetId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async unfollow(
    @Args('targetId') targetId: string,
    @AuthMember('_id') myId: string,
  ): Promise<boolean> {
    return this.followService.unfollowMember(myId, targetId);
  }

  @Query(() => Number)
  async followersCount(@Args('memberId') memberId: string): Promise<number> {
    return this.followService.countFollowers(memberId);
  }

  @Query(() => Number)
  async followingCount(@Args('memberId') memberId: string): Promise<number> {
    return this.followService.countFollowing(memberId);
  }

  @UseGuards(AuthGuard)
  @Query(() => Number)
  async myFollowersCount(@AuthMember('_id') myId: string): Promise<number> {
    return this.followService.countFollowers(myId);
  }

  @UseGuards(AuthGuard)
  @Query(() => Number)
  async myFollowingCount(@AuthMember('_id') myId: string): Promise<number> {
    return this.followService.countFollowing(myId);
  }

  @UseGuards(AuthGuard)
  @Query(() => Boolean)
  async lookupAuthMemberFollowed(
    @Args('targetId') targetId: string,
    @AuthMember('_id') myId: string,
  ): Promise<boolean> {
    return this.followService.isFollowed(myId, targetId);
  }
}
