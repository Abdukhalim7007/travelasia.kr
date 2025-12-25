import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

@InputType()
export class SignupInput {
  @IsNotEmpty()
  @IsEmail()
  @Field(() => String)
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @Field(() => String)
  password: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  fullName?: string;
}

@InputType()
export class LoginInput {
  @IsNotEmpty()
  @IsEmail()
  @Field(() => String)
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @Field(() => String)
  password: string;
}

