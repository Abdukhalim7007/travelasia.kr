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

  @Field(() => String, { nullable: true })
  agentId?: string;

  @Field(() => [String], { nullable: true })
  images?: string[];

  @Field(() => Number, { nullable: true })
  likesCount?: number;

  @Field(() => Number, { nullable: true })
  viewsCount?: number;

  @Field(() => Boolean, { nullable: true })
  meLiked?: boolean;

  @Field(() => Boolean, { nullable: true })
  meFavorited?: boolean;

  @Field(() => Number, { nullable: true })
  reviewsCount?: number;

  @Field(() => Number, { nullable: true })
  averageRating?: number;
}

