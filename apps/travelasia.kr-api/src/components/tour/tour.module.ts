import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TourResolver } from './tour.resolver';
import { TourService } from './tour.service';
import { Tour, TourSchema } from '../../schemas/Tour.model';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tour.name, schema: TourSchema }]),
    AuthModule,
  ],
  providers: [TourResolver, TourService],
  exports: [TourService],
})
export class TourModule {}
