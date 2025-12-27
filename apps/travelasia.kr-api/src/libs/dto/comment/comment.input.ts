import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString, Max, Min, IsOptional } from 'class-validator';

@InputType()
export class CreateCommentInput {
  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  tourId: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  @Field(() => Number)
  rating: number;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  content: string;
}

@InputType()
export class UpdateReviewInput {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  @Field(() => Int, { nullable: true })
  rating?: number;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  content?: string;
}
