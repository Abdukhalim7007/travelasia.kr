import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';
import { BookingStatus } from '../../enums/booking.enum';

registerEnumType(BookingStatus, {
  name: 'BookingStatus',
});

@ObjectType()
export class Booking {
  @Field(() => String)
  _id: string;

  @Field(() => String, { nullable: true })
  tourId?: string;

  @Field(() => String, { nullable: true })
  userId?: string;

  @Field(() => String, { nullable: true })
  agentId?: string;

  @Field(() => Number, { nullable: true })
  numberOfGuests?: number;

  @Field(() => BookingStatus, { nullable: true })
  status?: BookingStatus;

  @Field(() => Number, { nullable: true })
  totalPrice?: number;

  @Field(() => Date, { nullable: true })
  createdAt?: Date;
}

