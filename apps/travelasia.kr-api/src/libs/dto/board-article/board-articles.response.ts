import { Field, ObjectType } from '@nestjs/graphql';
import { BoardArticle } from './board-article';

@ObjectType()
export class BoardArticlesResponse {
  @Field(() => [BoardArticle])
  list: BoardArticle[];

  @Field(() => Number)
  total: number;
}

