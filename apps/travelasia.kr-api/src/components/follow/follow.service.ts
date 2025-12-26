import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Follow } from '../../schemas/Follow.model';
import { Member } from '../../schemas/Member.model';

@Injectable()
export class FollowService {
  constructor(
    @InjectModel(Follow.name) private readonly followModel: Model<Follow>,
    @InjectModel(Member.name) private readonly memberModel: Model<Member>,
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

  async getFollowersMembers(memberId: string): Promise<any[]> {
    const follows = await this.followModel
      .find({ followingId: memberId })
      .select('followerId')
      .lean()
      .exec();

    const followerIds = follows.map((f: any) => f.followerId);
    if (followerIds.length === 0) return [];

    return this.memberModel
      .find({ _id: { $in: followerIds } })
      .select('_id email fullName memberType')
      .lean()
      .exec();
  }

  async getFollowingMembers(memberId: string): Promise<any[]> {
    const follows = await this.followModel
      .find({ followerId: memberId })
      .select('followingId')
      .lean()
      .exec();

    const followingIds = follows.map((f: any) => f.followingId);
    if (followingIds.length === 0) return [];

    return this.memberModel
      .find({ _id: { $in: followingIds } })
      .select('_id email fullName memberType')
      .lean()
      .exec();
  }
}
