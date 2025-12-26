import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Favorite } from '../../schemas/Favorite.model';

@Injectable()
export class FavoriteService {
  constructor(@InjectModel(Favorite.name) private readonly favoriteModel: Model<Favorite>) {}

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

  async isFavorited(memberId: string, tourId: string): Promise<boolean> {
    const exists = await this.favoriteModel.exists({ memberId, tourId });
    return !!exists;
  }
}

