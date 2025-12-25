import { Resolver, Query } from '@nestjs/graphql';
import { Booking as BookingDTO } from '../../libs/dto/booking/booking';

@Resolver()
export class BookingResolver {
  @Query(() => [BookingDTO])
  bookings(): BookingDTO[] {
    return [];
  }
}
