import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { CommentDTO } from '../../libs/dto/comment/comment';
import { CreateCommentInput } from '../../libs/dto/comment/comment.input';
import { CommentService } from './comment.service';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';

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
}
