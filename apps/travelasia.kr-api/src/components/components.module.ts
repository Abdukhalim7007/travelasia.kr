import { Module } from '@nestjs/common';
import { MemberModule } from './member/member.module';
import { TourModule } from './tour/tour.module';

// Feature modules (Auth/Member/Tour/Booking/Payment) will be added incrementally
// Only import/export modules when their *.module.ts files exist

@Module({
  imports: [MemberModule, TourModule],
  exports: [MemberModule, TourModule],
})
export class ComponentsModule {}

