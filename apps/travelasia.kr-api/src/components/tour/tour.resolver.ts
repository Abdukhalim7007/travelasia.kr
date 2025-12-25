import { Resolver, Query } from '@nestjs/graphql';
import { Tour as TourDTO } from '../../libs/dto/tour/tour';

@Resolver()
export class TourResolver {
  @Query(() => [TourDTO])
  tours(): TourDTO[] {
    return [];
  }
}
