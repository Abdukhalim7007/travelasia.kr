import { Module } from '@nestjs/common';

// Feature modules (Auth/Member/Tour/Booking/Payment) will be added incrementally
// Only import/export modules when their *.module.ts files exist

@Module({
  imports: [],
  exports: [],
})
export class ComponentsModule {}

