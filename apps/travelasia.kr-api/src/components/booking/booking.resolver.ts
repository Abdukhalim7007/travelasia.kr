import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Booking as BookingDTO } from '../../libs/dto/booking/booking';
import { BookingService } from './booking.service';
import { BookingInput } from '../../libs/dto/booking/booking.input';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';

@Resolver()
export class BookingResolver {
  constructor(private readonly bookingService: BookingService) {}

  @Query(() => [BookingDTO])
  async bookings(): Promise<BookingDTO[]> {
    return this.bookingService.getBookings();
  }

  @UseGuards(AuthGuard)
  @Query(() => [BookingDTO])
  async myBookings(@AuthMember('_id') userId: string): Promise<BookingDTO[]> {
    return this.bookingService.getBookingsByUser(userId);
  }

  @Roles(MemberType.AGENT)
  @UseGuards(RolesGuard)
  @Query(() => [BookingDTO])
  async agentBookings(@AuthMember('_id') agentId: string): Promise<BookingDTO[]> {
    return this.bookingService.getBookingsByAgent(agentId);
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
