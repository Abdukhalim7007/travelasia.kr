import { Field, ObjectType } from '@nestjs/graphql';
import { Booking as BookingDTO } from './booking';

@ObjectType()
export class BookingsResponse {
  @Field(() => [BookingDTO])
  list: BookingDTO[];

  @Field(() => Number)
  total: number;
}

