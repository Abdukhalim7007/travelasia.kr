import { Resolver, Query, Args, Mutation, ResolveField, Parent, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Tour as TourDTO } from '../../libs/dto/tour/tour';
import { TourService } from './tour.service';
import { TourInput } from '../../libs/dto/tour/tour.input';
import { TourUpdate } from '../../libs/dto/tour/tour.update';
import { ToursInquiry } from '../../libs/dto/tour/tours.inquiry';
import { ToursResponse } from '../../libs/dto/tour/tours.response';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { LikeService } from '../like/like.service';
import { FavoriteService } from '../favorite/favorite.service';
import { VisitedService } from '../visited/visited.service';
import { LikeTargetType } from '../../libs/enums/like.enum';
import { GraphQLUpload, FileUpload } from 'graphql-upload';
import { CommentService } from '../comment/comment.service';

@Resolver(() => TourDTO)
export class TourResolver {
  constructor(
    private readonly tourService: TourService,
    private readonly likeService: LikeService,
    private readonly favoriteService: FavoriteService,
    private readonly visitedService: VisitedService,
    private readonly commentService: CommentService,
  ) {}

  @Query(() => ToursResponse)
  async getTours(
    @Args('input', { nullable: true }) input: ToursInquiry,
    @Context() ctx: any,
  ): Promise<ToursResponse> {
    const memberId = ctx?.req?.user?._id || ctx?.req?.member?._id;
    return this.tourService.getTours(input ?? ({} as any), memberId);
  }

  @Query(() => [TourDTO])
  async tours(@Context() ctx: any): Promise<TourDTO[]> {
    const memberId = ctx?.req?.user?._id || ctx?.req?.member?._id;
    return this.tourService.getAllTours(memberId);
  }

  @Query(() => TourDTO)
  async tour(@Args('tourId') tourId: string, @Context() ctx: any): Promise<TourDTO> {
    const memberId = ctx?.req?.user?._id || ctx?.req?.member?._id;
    return this.tourService.getTourById(tourId, memberId);
  }

  @Query(() => [TourDTO])
  async agentTours(@Args('agentId') agentId: string, @Context() ctx: any): Promise<TourDTO[]> {
    const memberId = ctx?.req?.user?._id || ctx?.req?.member?._id;
    return this.tourService.getToursByAgent(agentId, memberId);
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

  @Roles(MemberType.AGENT)
  @UseGuards(RolesGuard)
  @Mutation(() => TourDTO)
  async uploadTourImages(
    @Args('tourId') tourId: string,
    @Args({ name: 'files', type: () => [GraphQLUpload] }) files: FileUpload[],
    @AuthMember('_id') agentId: string,
  ): Promise<TourDTO> {
    return this.tourService.uploadTourImages(agentId, tourId, files);
  }

  @Roles(MemberType.ADMIN)
  @UseGuards(RolesGuard)
  @Query(() => [TourDTO])
  async getAllToursByAdmin(@Context() ctx: any): Promise<TourDTO[]> {
    const memberId = ctx?.req?.user?._id || ctx?.req?.member?._id;
    return this.tourService.getAllToursByAdmin(memberId);
  }

  @Roles(MemberType.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation(() => Boolean)
  async removeTourByAdmin(@Args('tourId') tourId: string): Promise<boolean> {
    return this.tourService.removeTourByAdmin(tourId);
  }

  @ResolveField(() => Number, { nullable: true })
  async likesCount(@Parent() tour: TourDTO): Promise<number> {
    // Stats are already attached by TourService batch loading
    return (tour as any).likesCount ?? 0;
  }

  @ResolveField(() => Number, { nullable: true })
  async viewsCount(@Parent() tour: TourDTO): Promise<number> {
    // Stats are already attached by TourService batch loading
    return (tour as any).viewsCount ?? 0;
  }

  @ResolveField(() => Boolean, { nullable: true })
  async meLiked(@Parent() tour: TourDTO, @Context() ctx: any): Promise<boolean> {
    // Stats are already attached by TourService batch loading
    if ((tour as any).meLiked !== undefined) {
      return (tour as any).meLiked;
    }
    // Fallback to old logic if not attached (minimal risk)
    const memberId = ctx?.req?.user?._id || ctx?.req?.member?._id;
    if (memberId) {
      return this.likeService.isLiked(memberId, String(tour._id), LikeTargetType.TOUR);
    }
    return false;
  }

  @ResolveField(() => Boolean, { nullable: true })
  async meFavorited(@Parent() tour: TourDTO, @Context() ctx: any): Promise<boolean> {
    // Stats are already attached by TourService batch loading
    if ((tour as any).meFavorited !== undefined) {
      return (tour as any).meFavorited;
    }
    // Fallback to old logic if not attached (minimal risk)
    const memberId = ctx?.req?.user?._id || ctx?.req?.member?._id;
    if (memberId) {
      return this.favoriteService.isFavorited(memberId, String(tour._id));
    }
    return false;
  }

  @ResolveField(() => Number, { nullable: true })
  async reviewsCount(@Parent() tour: TourDTO): Promise<number> {
    // Stats are already attached by TourService batch loading
    return (tour as any).reviewsCount ?? 0;
  }

  @ResolveField(() => Number, { nullable: true })
  async averageRating(@Parent() tour: TourDTO): Promise<number> {
    // Stats are already attached by TourService batch loading
    return (tour as any).averageRating ?? 0;
  }
}
