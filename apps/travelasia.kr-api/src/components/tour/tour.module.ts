import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TourResolver } from './tour.resolver';
import { TourService } from './tour.service';
import { Tour, TourSchema } from '../../schemas/Tour.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tour.name, schema: TourSchema }]),
  ],
  providers: [TourResolver, TourService],
  exports: [TourService],
})
export class TourModule {}

