import { Module } from '@nestjs/common';
import { MemberModule } from './member/member.module';

// Feature modules (Auth/Member/Tour/Booking/Payment) will be added incrementally
// Only import/export modules when their *.module.ts files exist

@Module({
  imports: [MemberModule],
  exports: [MemberModule],
})
export class ComponentsModule {}

