import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking } from '../../schemas/Booking.model';
import { Tour } from '../../schemas/Tour.model';
import { BookingInput } from '../../libs/dto/booking/booking.input';
import { BookingStatus } from '../../libs/enums/booking.enum';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name) private readonly bookingModel: Model<Booking>,
    @InjectModel(Tour.name) private readonly tourModel: Model<Tour>,
  ) {}

  async getBookings(): Promise<any[]> {
    return this.bookingModel.find().lean().exec();
  }

  async getBookingsByUser(userId: string): Promise<any[]> {
    return this.bookingModel.find({ userId }).sort({ createdAt: -1 }).lean().exec();
  }

  async getBookingsByAgent(agentId: string): Promise<any[]> {
    return this.bookingModel.find({ agentId }).sort({ createdAt: -1 }).lean().exec();
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
}
