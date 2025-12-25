import { Field, ObjectType } from '@nestjs/graphql';
import { TourStatus, TourType } from '../../enums/tour.enum';

@ObjectType()
export class Tour {
  @Field(() => String)
  _id: string;

  @Field(() => String)
  title: string;

  @Field(() => Number)
  tourPrice: number;

  @Field(() => String, { nullable: true })
  status?: TourStatus;

  @Field(() => String, { nullable: true })
  tourType?: TourType;

  @Field(() => Date, { nullable: true })
  createdAt?: Date;
}

