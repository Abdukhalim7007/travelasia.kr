import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CommentDTO } from '../../libs/dto/comment/comment';
import { CreateCommentInput, UpdateReviewInput } from '../../libs/dto/comment/comment.input';
import { CommentService } from './comment.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { MemberType } from '../../libs/enums/member.enum';

@Resolver(() => CommentDTO)
export class CommentResolver {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => CommentDTO)
  async createReview(
    @Args('input') input: CreateCommentInput,
    @AuthMember('_id') memberId: string,
  ): Promise<CommentDTO> {
    return this.commentService.createReview(memberId, input);
  }

  @Query(() => [CommentDTO])
  async getReviewsByTour(@Args('tourId') tourId: string): Promise<CommentDTO[]> {
    return this.commentService.getReviewsByTour(tourId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => CommentDTO)
  async updateReview(
    @AuthMember('_id') memberId: string,
    @Args('reviewId') reviewId: string,
    @Args('input') input: UpdateReviewInput,
  ): Promise<CommentDTO> {
    return this.commentService.updateReview(memberId, reviewId, input);
  }

  @Roles(MemberType.ADMIN, MemberType.AGENT)
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => Boolean)
  async removeReview(
    @AuthMember('_id') memberId: string,
    @AuthMember('memberType') memberType: MemberType,
    @Args('reviewId') reviewId: string,
  ): Promise<boolean> {
    return this.commentService.removeReview(memberId, memberType, reviewId);
  }
}
