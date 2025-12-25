import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { MemberType } from '../../enums/member.enum';

@InputType()
export class MemberInput {
  @IsNotEmpty()
  @IsEmail()
  @Field(() => String)
  email: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  fullName?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  memberType?: MemberType;
}

