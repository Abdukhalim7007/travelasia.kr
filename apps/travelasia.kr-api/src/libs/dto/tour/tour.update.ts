import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, IsNumber, IsEnum } from 'class-validator';
import { TourStatus, TourType } from '../../enums/tour.enum';

@InputType()
export class TourUpdate {
  @IsNotEmpty()
  @Field(() => String)
  _id: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  title?: string;

  @IsOptional()
  @IsEnum(TourType)
  @Field(() => String, { nullable: true })
  tourType?: TourType;

  @IsOptional()
  @IsEnum(TourStatus)
  @Field(() => String, { nullable: true })
  status?: TourStatus;

  @IsOptional()
  @IsNumber()
  @Field(() => Number, { nullable: true })
  tourPrice?: number;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  description?: string;
}

