import { Resolver, Mutation } from '@nestjs/graphql';

@Resolver()
export class AuthResolver {
  @Mutation(() => String)
  signup(): string {
    return 'DUMMY_TOKEN';
  }

  @Mutation(() => String)
  login(): string {
    return 'DUMMY_TOKEN';
  }
}

