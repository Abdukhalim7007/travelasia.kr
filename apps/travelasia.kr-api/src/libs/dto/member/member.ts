import { Field, ObjectType } from '@nestjs/graphql';
import { MemberType } from '../../enums/member.enum';

@ObjectType()
export class Member {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  email: string;

  @Field(() => String, { nullable: true })
  fullName?: string;

  @Field(() => String, { nullable: true })
  memberType?: MemberType;

  @Field(() => String, { nullable: true })
  avatar?: string;
}

