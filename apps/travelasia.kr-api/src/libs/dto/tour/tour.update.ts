import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { TourStatus, TourType } from '../../enums/tour.enum';

@InputType()
export class TourUpdate {
  @IsOptional()
  @Field(() => String, { nullable: true })
  title?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  tourType?: TourType;

  @IsOptional()
  @Field(() => String, { nullable: true })
  status?: TourStatus;
}

