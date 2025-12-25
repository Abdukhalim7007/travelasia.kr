import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class BookingResolver {
  @Query(() => [String])
  bookings(): string[] {
    return [];
  }
}

