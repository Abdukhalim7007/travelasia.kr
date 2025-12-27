import { Field, ObjectType } from '@nestjs/graphql';
import { CommentDTO } from './comment';

@ObjectType()
export class CommentsResponse {
  @Field(() => [CommentDTO])
  list: CommentDTO[];

  @Field(() => Number)
  total: number;
}

