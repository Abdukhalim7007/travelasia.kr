import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { BoardArticle as BoardArticleDTO } from '../../libs/dto/board-article/board-article';
import { BoardArticleService } from './board-article.service';
import { CreateBoardArticleInput } from '../../libs/dto/board-article/board-article.input';
import { BoardArticlesInquiry } from '../../libs/dto/board-article/board-articles.inquiry';
import { BoardArticlesResponse } from '../../libs/dto/board-article/board-articles.response';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { MemberType } from '../../libs/enums/member.enum';

@Resolver()
export class BoardArticleResolver {
  constructor(private readonly boardArticleService: BoardArticleService) {}

  @Query(() => BoardArticlesResponse)
  async getArticles(
    @Args('input', { nullable: true }) input?: BoardArticlesInquiry,
  ): Promise<BoardArticlesResponse> {
    return this.boardArticleService.getArticles(input ?? ({} as any));
  }

  @Roles(MemberType.ADMIN, MemberType.AGENT)
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => BoardArticleDTO)
  async createArticle(
    @Args('input') input: CreateBoardArticleInput,
    @AuthMember('_id') memberId: string,
  ): Promise<BoardArticleDTO> {
    return this.boardArticleService.createArticle(memberId, input);
  }
}

