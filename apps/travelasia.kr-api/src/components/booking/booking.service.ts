import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking } from '../../schemas/Booking.model';
import { Tour } from '../../schemas/Tour.model';
import { BookingInput } from '../../libs/dto/booking/booking.input';
import { BookingUpdate } from '../../libs/dto/booking/booking.update';
import { BookingStatus } from '../../libs/enums/booking.enum';
import { MemberType } from '../../libs/enums/member.enum';
import { BookingsInquiry } from '../../libs/dto/booking/bookings.inquiry';
import { BookingsResponse } from '../../libs/dto/booking/bookings.response';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name) private readonly bookingModel: Model<Booking>,
    @InjectModel(Tour.name) private readonly tourModel: Model<Tour>,
  ) {}

  async getBookings(input: BookingsInquiry): Promise<BookingsResponse> {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      direction = -1,
      search,
    } = input;

    const filter: any = {};
    if (search) {
      filter.notes = { $regex: search, $options: 'i' };
    }

    const total = await this.bookingModel.countDocuments(filter).exec();
    const list = await this.bookingModel
      .find(filter)
      .sort({ [sort]: direction as any })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .exec();

    return { list: list as any, total };
  }

  async getBookingsLegacy(): Promise<any[]> {
    return this.bookingModel.find().lean().exec();
  }

  async getBookingsByUser(userId: string): Promise<any[]> {
    return this.bookingModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  async getBookingsByAgent(agentId: string): Promise<any[]> {
    return this.bookingModel
      .find({ agentId })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  async createBooking(userId: string, input: BookingInput): Promise<any> {
    const tour = await this.tourModel.findById(input.tourId).lean().exec();
    if (!tour) throw new NotFoundException('Tour not found');

    const totalPrice = Number(tour.tourPrice) * Number(input.numberOfGuests);

    return this.bookingModel.create({
      tourId: input.tourId,
      userId,
      agentId: tour.agentId,
      numberOfGuests: input.numberOfGuests,
      totalPrice,
      status: BookingStatus.PENDING,
    });
  }

  async cancelBooking(userId: string, bookingId: string): Promise<any> {
    const booking = await this.bookingModel
      .findOneAndUpdate(
        { _id: bookingId, userId, status: BookingStatus.PENDING },
        { $set: { status: BookingStatus.CANCELLED } },
        { new: true, lean: true },
      )
      .exec();

    if (!booking)
      throw new NotFoundException('Booking not found or not cancellable');
    return booking;
  }

  async updateBookingStatus(agentId: string, input: BookingUpdate): Promise<any> {
    const booking = await this.bookingModel.findOneAndUpdate(
      { _id: input._id, agentId },
      { $set: { status: input.status } },
      { new: true, lean: true }
    ).exec();

    if (!booking) throw new NotFoundException('Booking not found or access denied');
    return booking;
  }

  async getBookingByIdForMember(
    memberId: string,
    memberType: MemberType,
    bookingId: string,
  ): Promise<any> {
    const filter =
      memberType === MemberType.AGENT
        ? { _id: bookingId, agentId: memberId }
        : { _id: bookingId, userId: memberId };

    const booking = await this.bookingModel.findOne(filter).lean().exec();
    if (!booking) throw new NotFoundException('Booking not found or access denied');
    return booking;
  }
}
