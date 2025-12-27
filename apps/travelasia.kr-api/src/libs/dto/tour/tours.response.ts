import { Field, ObjectType } from '@nestjs/graphql';
import { Tour } from './tour';

@ObjectType()
export class ToursResponse {
  @Field(() => [Tour])
  list: Tour[];

  @Field(() => Number)
  total: number;
}
