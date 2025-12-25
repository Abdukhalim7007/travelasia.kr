import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Booking as BookingDTO } from '../../libs/dto/booking/booking';
import { BookingService } from './booking.service';
import { BookingInput } from '../../libs/dto/booking/booking.input';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';

@Resolver()
export class BookingResolver {
  constructor(private readonly bookingService: BookingService) {}

  @Query(() => [BookingDTO])
  async bookings(): Promise<BookingDTO[]> {
    return this.bookingService.getBookings();
  }

  @UseGuards(AuthGuard)
  @Mutation(() => BookingDTO)
  async createBooking(
    @Args('input') input: BookingInput,
    @AuthMember('_id') userId: string,
  ): Promise<BookingDTO> {
    return this.bookingService.createBooking(userId, input);
  }
}
