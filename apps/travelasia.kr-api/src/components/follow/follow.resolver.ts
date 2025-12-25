import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { FollowService } from './follow.service';
import { Follow as FollowDTO } from '../../libs/dto/follow/follow';
import { FollowInput } from '../../libs/dto/follow/follow.input';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';

@Resolver()
export class FollowResolver {
  constructor(private readonly followService: FollowService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => FollowDTO)
  async follow(
    @Args('input') input: FollowInput,
    @AuthMember('_id') myId: string,
  ): Promise<FollowDTO> {
    return this.followService.followMember(myId, input.targetId);
  }
}

