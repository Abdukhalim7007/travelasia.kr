import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class VisitedDTO {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  memberId: string;

  @Field(() => String)
  tourId: string;

  @Field(() => Date, { nullable: true })
  visitedAt?: Date;

  @Field(() => Date, { nullable: true })
  createdAt?: Date;
}
