import { Module } from '@nestjs/common';
import { TravelasiaKrBatchController } from './travelasia.kr-batch.controller';
import { TravelasiaKrBatchService } from './travelasia.kr-batch.service';

@Module({
  imports: [],
  controllers: [TravelasiaKrBatchController],
  providers: [TravelasiaKrBatchService],
})
export class TravelasiaKrBatchModule {}
