import { Resolver, Query } from '@nestjs/graphql';
import { Booking as BookingDTO } from '../../libs/dto/booking/booking';
import { BookingService } from './booking.service';

@Resolver()
export class BookingResolver {
  constructor(private readonly bookingService: BookingService) {}

  @Query(() => [BookingDTO])
  async bookings(): Promise<BookingDTO[]> {
    return this.bookingService.getBookings();
  }
}
