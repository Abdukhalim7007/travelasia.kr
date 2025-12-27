import { Field, ObjectType } from '@nestjs/graphql';
import { LikeDTO } from './like';

@ObjectType()
export class LikesResponse {
  @Field(() => [LikeDTO])
  list: LikeDTO[];

  @Field(() => Number)
  total: number;
}

