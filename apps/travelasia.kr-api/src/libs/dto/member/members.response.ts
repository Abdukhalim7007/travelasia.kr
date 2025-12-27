import { Field, ObjectType } from '@nestjs/graphql';
import { Member as MemberDTO } from './member';

@ObjectType()
export class MembersResponse {
  @Field(() => [MemberDTO])
  list: MemberDTO[];

  @Field(() => Number)
  total: number;
}

