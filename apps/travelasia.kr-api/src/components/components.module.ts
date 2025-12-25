import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MemberModule } from './member/member.module';
import { TourModule } from './tour/tour.module';
import { BookingModule } from './booking/booking.module';

// Feature modules (Auth/Member/Tour/Booking/Payment) will be added incrementally
// Only import/export modules when their *.module.ts files exist

@Module({
  imports: [AuthModule, MemberModule, TourModule, BookingModule],
  exports: [AuthModule, MemberModule, TourModule, BookingModule],
})
export class ComponentsModule {}

