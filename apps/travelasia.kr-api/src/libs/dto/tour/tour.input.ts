import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { TourType } from '../../enums/tour.enum';

@InputType()
export class TourInput {
  @IsNotEmpty()
  @Field(() => String)
  title: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  tourType?: TourType;
}

