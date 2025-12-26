import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Favorite } from '../../schemas/Favorite.model';
import { Tour } from '../../schemas/Tour.model';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectModel(Favorite.name) private readonly favoriteModel: Model<Favorite>,
    @InjectModel(Tour.name) private readonly tourModel: Model<Tour>,
  ) {}

  async addFavorite(memberId: string, tourId: string): Promise<any> {
    try {
      const created = await this.favoriteModel.create({
        memberId,
        tourId,
      });
      return created?.toObject ? created.toObject() : created;
    } catch (error: any) {
      if (error?.code === 11000) {
        throw new ConflictException('Already favorited');
      }
      throw error;
    }
  }

  async removeFavorite(memberId: string, tourId: string): Promise<boolean> {
    const res = await this.favoriteModel.deleteOne({ memberId, tourId }).exec();
    if (res.deletedCount === 0) throw new NotFoundException('Favorite not found');
    return true;
  }

  async getMyFavorites(memberId: string): Promise<any[]> {
    return await this.favoriteModel.find({ memberId }).sort({ createdAt: -1 }).lean().exec();
  }

  async getMyFavoriteTours(memberId: string): Promise<any[]> {
    const favorites = await this.favoriteModel
      .find({ memberId })
      .sort({ createdAt: -1 })
      .select('tourId')
      .lean()
      .exec();

    const tourIds = favorites.map((f: any) => f.tourId);
    if (tourIds.length === 0) return [];

    const tours = await this.tourModel
      .find({ _id: { $in: tourIds } })
      .lean()
      .exec();

    const tourMap = new Map(tours.map((t: any) => [String(t._id), t]));
    return tourIds.map((id: any) => tourMap.get(String(id))).filter(Boolean);
  }

  async isFavorited(memberId: string, tourId: string): Promise<boolean> {
    const exists = await this.favoriteModel.exists({ memberId, tourId });
    return !!exists;
  }
}

