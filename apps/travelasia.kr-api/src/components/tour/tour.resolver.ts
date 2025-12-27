import { Resolver, Query, Args, Mutation, ResolveField, Parent, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Tour as TourDTO } from '../../libs/dto/tour/tour';
import { TourService } from './tour.service';
import { TourInput } from '../../libs/dto/tour/tour.input';
import { TourUpdate } from '../../libs/dto/tour/tour.update';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { LikeService } from '../like/like.service';
import { FavoriteService } from '../favorite/favorite.service';
import { VisitedService } from '../visited/visited.service';
import { LikeTargetType } from '../../libs/enums/like.enum';

@Resolver(() => TourDTO)
export class TourResolver {
  constructor(
    private readonly tourService: TourService,
    private readonly likeService: LikeService,
    private readonly favoriteService: FavoriteService,
    private readonly visitedService: VisitedService,
  ) {}

  @Query(() => [TourDTO])
  async tours(): Promise<TourDTO[]> {
    return this.tourService.getTours();
  }

  @Query(() => TourDTO)
  async tour(@Args('tourId') tourId: string): Promise<TourDTO> {
    return this.tourService.getTourById(tourId);
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

  @Roles(MemberType.AGENT)
  @UseGuards(RolesGuard)
  @Mutation(() => TourDTO)
  async updateTour(
    @Args('input') input: TourUpdate,
    @AuthMember('_id') agentId: string,
  ): Promise<TourDTO> {
    return this.tourService.updateTour(agentId, input);
  }

  @Roles(MemberType.AGENT)
  @UseGuards(RolesGuard)
  @Mutation(() => Boolean)
  async removeTour(
    @Args('tourId') tourId: string,
    @AuthMember('_id') agentId: string,
  ): Promise<boolean> {
    return this.tourService.removeTour(agentId, tourId);
  }

  @ResolveField(() => Number, { nullable: true })
  async likesCount(@Parent() tour: TourDTO): Promise<number> {
    return this.likeService.countLikes(String(tour._id), LikeTargetType.TOUR);
  }

  @ResolveField(() => Number, { nullable: true })
  async viewsCount(@Parent() tour: TourDTO): Promise<number> {
    return this.visitedService.countViews(String(tour._id));
  }

  @ResolveField(() => Boolean, { nullable: true })
  async meLiked(@Parent() tour: TourDTO, @Context() ctx: any): Promise<boolean> {
    const memberId = ctx?.req?.user?._id || ctx?.req?.member?._id;
    if (memberId) {
      return this.likeService.isLiked(memberId, String(tour._id), LikeTargetType.TOUR);
    }
    return false;
  }

  @ResolveField(() => Boolean, { nullable: true })
  async meFavorited(@Parent() tour: TourDTO, @Context() ctx: any): Promise<boolean> {
    const memberId = ctx?.req?.user?._id || ctx?.req?.member?._id;
    if (memberId) {
      return this.favoriteService.isFavorited(memberId, String(tour._id));
    }
    return false;
  }
}
