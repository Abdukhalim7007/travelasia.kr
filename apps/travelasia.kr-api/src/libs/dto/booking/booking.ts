import { Field, ObjectType } from '@nestjs/graphql';
import { BookingStatus } from '../../enums/booking.enum';

@ObjectType()
export class Booking {
  @Field(() => String)
  _id: string;

  @Field(() => String, { nullable: true })
  status?: BookingStatus;

  @Field(() => Number, { nullable: true })
  totalPrice?: number;

  @Field(() => Date, { nullable: true })
  createdAt?: Date;
}

