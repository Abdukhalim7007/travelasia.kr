import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FavoriteService } from './favorite.service';
import { FavoriteDTO } from '../../libs/dto/favorite/favorite';
import { FavoriteInput } from '../../libs/dto/favorite/favorite.input';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { Tour as TourDTO } from '../../libs/dto/tour/tour';

@Resolver()
export class FavoriteResolver {
  constructor(private readonly favoriteService: FavoriteService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => FavoriteDTO)
  async addFavorite(
    @Args('input') input: FavoriteInput,
    @AuthMember('_id') memberId: string,
  ): Promise<FavoriteDTO> {
    return this.favoriteService.addFavorite(memberId, input.tourId);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Boolean)
  async removeFavorite(
    @Args('tourId') tourId: string,
    @AuthMember('_id') memberId: string,
  ): Promise<boolean> {
    return this.favoriteService.removeFavorite(memberId, tourId);
  }

  @UseGuards(AuthGuard)
  @Query(() => [FavoriteDTO])
  async myFavorites(@AuthMember('_id') memberId: string): Promise<FavoriteDTO[]> {
    return this.favoriteService.getMyFavorites(memberId);
  }

  @UseGuards(AuthGuard)
  @Query(() => [TourDTO])
  async myFavoriteTours(@AuthMember('_id') memberId: string): Promise<TourDTO[]> {
    return this.favoriteService.getMyFavoriteTours(memberId);
  }

  @UseGuards(AuthGuard)
  @Query(() => Boolean)
  async lookupAuthMemberFavorited(
    @Args('tourId') tourId: string,
    @AuthMember('_id') memberId: string,
  ): Promise<boolean> {
    return this.favoriteService.isFavorited(memberId, tourId);
  }
}

