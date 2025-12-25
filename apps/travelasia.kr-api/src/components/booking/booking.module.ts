import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingResolver } from './booking.resolver';
import { BookingService } from './booking.service';
import { Booking, BookingSchema } from '../../schemas/Booking.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
  ],
  providers: [BookingResolver, BookingService],
  exports: [BookingService],
})
export class BookingModule {}

