import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { VisitedService } from './visited.service';
import { VisitedDTO } from '../../libs/dto/visited/visited';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';

@Resolver()
export class VisitedResolver {
  constructor(private readonly visitedService: VisitedService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async recordVisitedTour(
    @Args('tourId') tourId: string,
    @AuthMember('_id') memberId: string,
  ): Promise<boolean> {
    return this.visitedService.recordVisit(memberId, tourId);
  }

  @UseGuards(AuthGuard)
  @Query(() => [VisitedDTO])
  async myVisitedTours(@AuthMember('_id') memberId: string): Promise<VisitedDTO[]> {
    return this.visitedService.getMyVisitedTours(memberId);
  }
}
