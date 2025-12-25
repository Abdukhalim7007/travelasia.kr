import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { TourType } from '../../enums/tour.enum';

@InputType()
export class TourInput {
  @IsNotEmpty()
  @Field(() => String)
  title: string;

  @IsNotEmpty()
  @Field(() => String)
  tourType: TourType;

  @IsNotEmpty()
  @IsNumber()
  @Field(() => Number)
  tourPrice: number;

  @IsOptional()
  @Field(() => String, { nullable: true })
  description?: string;
}

