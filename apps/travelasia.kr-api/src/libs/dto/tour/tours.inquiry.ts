import { Field, InputType } from '@nestjs/graphql';
import { IsOptional, IsNumber, IsString, Min } from 'class-validator';

@InputType()
export class ToursInquiry {
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

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  location?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  type?: string;

  @IsOptional()
  @IsNumber()
  @Field(() => Number, { nullable: true })
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Field(() => Number, { nullable: true })
  maxPrice?: number;
}
