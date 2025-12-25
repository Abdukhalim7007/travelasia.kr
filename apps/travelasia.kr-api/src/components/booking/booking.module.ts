import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingResolver } from './booking.resolver';
import { BookingService } from './booking.service';
import { Booking, BookingSchema } from '../../schemas/Booking.model';
import { Tour, TourSchema } from '../../schemas/Tour.model';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema },
      { name: Tour.name, schema: TourSchema },
    ]),
    AuthModule,
  ],
  providers: [BookingResolver, BookingService],
  exports: [BookingService],
})
export class BookingModule {}
