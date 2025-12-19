import { Controller, Get } from '@nestjs/common';
import { TravelasiaKrBatchService } from './travelasia.kr-batch.service';

@Controller()
export class TravelasiaKrBatchController {
  constructor(private readonly travelasiaKrBatchService: TravelasiaKrBatchService) {}

  @Get()
  getHello(): string {
    return this.travelasiaKrBatchService.getHello();
  }
}
