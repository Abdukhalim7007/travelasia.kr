import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LikeService } from './like.service';
import { LikeDTO } from '../../libs/dto/like/like';
import { LikeInput } from '../../libs/dto/like/like.input';
import { LikeTargetType } from '../../libs/enums/like.enum';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';

@Resolver()
export class LikeResolver {
  constructor(private readonly likeService: LikeService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => LikeDTO)
  async like(
    @Args('input') input: LikeInput,
    @AuthMember('_id') memberId: string,
  ): Promise<LikeDTO> {
    return this.likeService.like(memberId, input);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async unlike(
    @Args('targetId') targetId: string,
    @Args('targetType') targetType: LikeTargetType,
    @AuthMember('_id') memberId: string,
  ): Promise<boolean> {
    return this.likeService.unlike(memberId, targetId, targetType);
  }

  @UseGuards(AuthGuard)
  @Query(() => Boolean)
  async lookupAuthMemberLiked(
    @Args('targetId') targetId: string,
    @Args('targetType') targetType: LikeTargetType,
    @AuthMember('_id') memberId: string,
  ): Promise<boolean> {
    return this.likeService.isLiked(memberId, targetId, targetType);
  }

  @Query(() => Number)
  async likesCount(@Args('targetId') targetId: string): Promise<number> {
    return this.likeService.countLikes(targetId, LikeTargetType.TOUR);
  }
}
