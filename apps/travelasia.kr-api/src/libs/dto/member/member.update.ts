import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional } from 'class-validator';
import { MemberType } from '../../enums/member.enum';

@InputType()
export class MemberUpdate {
  @IsOptional()
  @IsEmail()
  @Field(() => String, { nullable: true })
  email?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  fullName?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  memberType?: MemberType;
}

