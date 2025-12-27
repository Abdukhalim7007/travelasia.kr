import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsNumber, IsString, Min } from 'class-validator';

@InputType()
export class BoardArticlesInquiry {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Field(() => Number, { nullable: true })
  page?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Field(() => Number, { nullable: true })
  limit?: number;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  sort?: string;

  @IsOptional()
  @IsNumber()
  @Field(() => Number, { nullable: true })
  direction?: number;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  search?: string;
}

