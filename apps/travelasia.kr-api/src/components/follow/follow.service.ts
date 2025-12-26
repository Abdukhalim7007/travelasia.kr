import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Follow } from '../../schemas/Follow.model';

@Injectable()
export class FollowService {
  constructor(
    @InjectModel(Follow.name) private readonly followModel: Model<Follow>,
  ) {}

  async followMember(myId: string, targetId: string): Promise<any> {
    if (myId === targetId) {
      throw new BadRequestException('Cannot follow yourself');
    }

    try {
      const created = await this.followModel.create({
        followerId: myId,
        followingId: targetId,
      });
      return created;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Already following this member');
      }
      throw error;
    }
  }

  async unfollowMember(myId: string, targetId: string): Promise<boolean> {
    const res = await this.followModel
      .deleteOne({ followerId: myId, followingId: targetId })
      .exec();
    if (res.deletedCount === 0)
      throw new NotFoundException('Follow relation not found');
    return true;
  }

  async getFollowers(memberId: string): Promise<any[]> {
    return this.followModel
      .find({ followingId: memberId })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  async getFollowing(memberId: string): Promise<any[]> {
    return this.followModel
      .find({ followerId: memberId })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
  }

  async countFollowers(memberId: string): Promise<number> {
    return this.followModel.countDocuments({ followingId: memberId }).exec();
  }

  async countFollowing(memberId: string): Promise<number> {
    return this.followModel.countDocuments({ followerId: memberId }).exec();
  }

  async isFollowed(myId: string, targetId: string): Promise<boolean> {
    const exists = await this.followModel
      .exists({ followerId: myId, followingId: targetId })
      .exec();
    return !!exists;
  }
}
