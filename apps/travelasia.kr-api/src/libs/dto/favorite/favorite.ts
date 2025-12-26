import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FavoriteDTO {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  memberId: string;

  @Field(() => String)
  tourId: string;

  @Field(() => Date, { nullable: true })
  createdAt?: Date;
}

