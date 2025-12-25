import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class TourResolver {
  @Query(() => [String])
  tours(): string[] {
    return [];
  }
}

