import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Like } from '../../schemas/Like.model';
import { LikeInput } from '../../libs/dto/like/like.input';
import { LikeTargetType } from '../../libs/enums/like.enum';

@Injectable()
export class LikeService {
  constructor(@InjectModel(Like.name) private readonly likeModel: Model<Like>) {}

  async like(memberId: string, input: LikeInput): Promise<any> {
    try {
      const created = await this.likeModel.create({
        memberId,
        targetId: input.targetId,
        targetType: input.targetType,
      });
      return created?.toObject ? created.toObject() : created;
    } catch (error: any) {
      if (error?.code === 11000) {
        throw new ConflictException('Already liked');
      }
      throw error;
    }
  }

  async unlike(memberId: string, targetId: string, targetType: LikeTargetType): Promise<boolean> {
    const res = await this.likeModel.deleteOne({ memberId, targetId, targetType }).exec();
    if (res.deletedCount === 0) throw new NotFoundException('Like not found');
    return true;
  }

  async isLiked(memberId: string, targetId: string, targetType: LikeTargetType): Promise<boolean> {
    const exists = await this.likeModel.exists({ memberId, targetId, targetType });
    return !!exists;
  }

  async countLikes(
    targetId: string,
    targetType: LikeTargetType = LikeTargetType.TOUR,
  ): Promise<number> {
    return this.likeModel.countDocuments({ targetId, targetType }).exec();
  }
}
