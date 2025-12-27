import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Booking as BookingDTO } from '../../libs/dto/booking/booking';
import { BookingService } from './booking.service';
import { BookingInput } from '../../libs/dto/booking/booking.input';
import { BookingUpdate } from '../../libs/dto/booking/booking.update';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { BookingsInquiry } from '../../libs/dto/booking/bookings.inquiry';
import { BookingsResponse } from '../../libs/dto/booking/bookings.response';
import { BookingStatus } from '../../libs/enums/booking.enum';

@Resolver()
export class BookingResolver {
  constructor(private readonly bookingService: BookingService) {}

  @Query(() => BookingsResponse)
  async bookings(@Args('input') input: BookingsInquiry): Promise<BookingsResponse> {
    return this.bookingService.getBookings(input);
  }

  @Query(() => [BookingDTO])
  async bookingsLegacy(): Promise<BookingDTO[]> {
    return this.bookingService.getBookingsLegacy();
  }

  @UseGuards(AuthGuard)
  @Query(() => [BookingDTO])
  async myBookings(@AuthMember('_id') userId: string): Promise<BookingDTO[]> {
    return this.bookingService.getBookingsByUser(userId);
  }

  @Roles(MemberType.AGENT)
  @UseGuards(RolesGuard)
  @Query(() => [BookingDTO])
  async agentBookings(
    @AuthMember('_id') agentId: string,
  ): Promise<BookingDTO[]> {
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

  @UseGuards(AuthGuard)
  @Mutation(() => BookingDTO)
  async cancelBooking(
    @Args('bookingId') bookingId: string,
    @AuthMember('_id') userId: string,
  ): Promise<BookingDTO> {
    return this.bookingService.cancelBooking(userId, bookingId);
  }

  @Roles(MemberType.AGENT)
  @UseGuards(RolesGuard)
  @Mutation(() => BookingDTO)
  async agentUpdateBooking(
    @Args('input') input: BookingUpdate,
    @AuthMember('_id') agentId: string,
  ): Promise<BookingDTO> {
    return this.bookingService.updateBookingStatus(agentId, input);
  }

  @UseGuards(AuthGuard)
  @Query(() => BookingDTO)
  async booking(
    @Args('bookingId') bookingId: string,
    @AuthMember('_id') memberId: string,
    @AuthMember('memberType') memberType: MemberType,
  ): Promise<BookingDTO> {
    return this.bookingService.getBookingByIdForMember(memberId, memberType, bookingId);
  }

  @Roles(MemberType.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Query(() => BookingsResponse)
  async getAllBookingsByAdmin(
    @Args('input', { nullable: true }) input?: BookingsInquiry,
  ): Promise<BookingsResponse> {
    return this.bookingService.getAllBookingsByAdmin(input);
  }

  @Roles(MemberType.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => BookingDTO)
  async cancelBookingByAdmin(@Args('bookingId') bookingId: string): Promise<BookingDTO> {
    return this.bookingService.cancelBookingByAdmin(bookingId);
  }

  @Roles(MemberType.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @Mutation(() => BookingDTO)
  async updateBookingStatusByAdmin(
    @Args('bookingId') bookingId: string,
    @Args('status', { type: () => BookingStatus }) status: BookingStatus,
  ): Promise<BookingDTO> {
    return this.bookingService.updateBookingStatusByAdmin(bookingId, status);
  }
}
