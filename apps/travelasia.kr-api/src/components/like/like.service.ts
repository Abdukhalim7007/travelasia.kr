import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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

  async getCountsByTargetIds(
    targetIds: (string | Types.ObjectId)[],
    targetType: LikeTargetType,
  ): Promise<Map<string, number>> {
    if (!targetIds || targetIds.length === 0) {
      return new Map();
    }

    const objectIds = targetIds.map((id) => (typeof id === 'string' ? new Types.ObjectId(id) : id));

    const result = await this.likeModel.aggregate([
      { $match: { targetId: { $in: objectIds }, targetType } },
      { $group: { _id: '$targetId', count: { $sum: 1 } } },
    ]).exec();

    const countsMap = new Map<string, number>();
    result.forEach((item) => {
      const targetIdStr = String(item._id);
      countsMap.set(targetIdStr, item.count);
    });

    // Ensure all targetIds have entries (default to 0 if no likes)
    targetIds.forEach((id) => {
      const idStr = String(id);
      if (!countsMap.has(idStr)) {
        countsMap.set(idStr, 0);
      }
    });

    return countsMap;
  }

  async getMeLikedMap(
    memberId: string,
    targetIds: (string | Types.ObjectId)[],
    targetType: LikeTargetType,
  ): Promise<Map<string, boolean>> {
    if (!targetIds || targetIds.length === 0 || !memberId) {
      return new Map();
    }

    const objectIds = targetIds.map((id) => (typeof id === 'string' ? new Types.ObjectId(id) : id));

    const likes = await this.likeModel
      .find({ memberId, targetId: { $in: objectIds }, targetType })
      .select('targetId')
      .lean()
      .exec();

    const likedMap = new Map<string, boolean>();
    targetIds.forEach((id) => {
      likedMap.set(String(id), false);
    });

    likes.forEach((like: any) => {
      likedMap.set(String(like.targetId), true);
    });

    return likedMap;
  }
}
