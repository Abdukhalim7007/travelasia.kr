import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CommentDTO {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  tourId: string;

  @Field(() => String)
  memberId: string;

  @Field(() => Number)
  rating: number;

  @Field(() => String)
  content: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
