import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Tour as TourDTO } from '../../libs/dto/tour/tour';
import { TourService } from './tour.service';
import { TourInput } from '../../libs/dto/tour/tour.input';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { MemberType } from '../../libs/enums/member.enum';

@Resolver()
export class TourResolver {
  constructor(private readonly tourService: TourService) {}

  @Query(() => [TourDTO])
  async tours(): Promise<TourDTO[]> {
    return this.tourService.getTours();
  }

  @Query(() => [TourDTO])
  async agentTours(@Args('agentId') agentId: string): Promise<TourDTO[]> {
    return this.tourService.getToursByAgent(agentId);
  }

  @Roles(MemberType.AGENT)
  @UseGuards(RolesGuard)
  @Mutation(() => TourDTO)
  async createTour(
    @Args('input') input: TourInput,
    @AuthMember('_id') agentId: string,
  ): Promise<TourDTO> {
    return this.tourService.createTour(agentId, input);
  }
}
