import { Resolver, Query } from '@nestjs/graphql';
import { Tour as TourDTO } from '../../libs/dto/tour/tour';
import { TourService } from './tour.service';

@Resolver()
export class TourResolver {
  constructor(private readonly tourService: TourService) {}

  @Query(() => [TourDTO])
  async tours(): Promise<TourDTO[]> {
    return this.tourService.getTours();
  }
}
