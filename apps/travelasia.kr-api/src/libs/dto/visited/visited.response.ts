import { Field, ObjectType } from '@nestjs/graphql';
import { VisitedDTO } from './visited';

@ObjectType()
export class VisitedResponse {
  @Field(() => [VisitedDTO])
  list: VisitedDTO[];

  @Field(() => Number)
  total: number;
}

