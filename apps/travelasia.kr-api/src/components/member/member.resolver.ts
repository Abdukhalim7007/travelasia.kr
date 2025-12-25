import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class MemberResolver {
  @Query(() => [String])
  members(): string[] {
    return [];
  }
}
