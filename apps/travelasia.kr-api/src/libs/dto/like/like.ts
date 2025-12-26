import { Field, ObjectType } from '@nestjs/graphql';
import { LikeTargetType } from '../../enums/like.enum';

@ObjectType()
export class LikeDTO {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  memberId: string;

  @Field(() => String)
  targetId: string;

  @Field(() => String)
  targetType: LikeTargetType;

  @Field(() => Date, { nullable: true })
  createdAt?: Date;
}

