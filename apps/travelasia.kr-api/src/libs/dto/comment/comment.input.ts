import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

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
