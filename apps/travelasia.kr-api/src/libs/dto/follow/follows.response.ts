import { Field, ObjectType } from '@nestjs/graphql';
import { Follow as FollowDTO } from './follow';

@ObjectType()
export class FollowsResponse {
  @Field(() => [FollowDTO])
  list: FollowDTO[];

  @Field(() => Number)
  total: number;
}

