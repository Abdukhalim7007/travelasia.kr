import { Resolver } from '@nestjs/graphql';
import { FollowService } from './follow.service';

@Resolver()
export class FollowResolver {
  constructor(private readonly followService: FollowService) {}

  // Queries and mutations will be added incrementally
}

