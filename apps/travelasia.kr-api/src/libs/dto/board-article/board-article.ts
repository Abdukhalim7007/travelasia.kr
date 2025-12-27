import { Field, ObjectType } from '@nestjs/graphql';
import { BoardArticleStatus } from '../../../schemas/BoardArticle.model';

@ObjectType()
export class BoardArticle {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  content: string;

  @Field(() => String)
  authorId: string;

  @Field(() => String)
  status: BoardArticleStatus;

  @Field(() => Number)
  viewsCount: number;

  @Field(() => Date)
  createdAt: Date;
}

