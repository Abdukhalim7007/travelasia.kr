import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
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
      const follow = await this.followModel.create({
        followerId: myId,
        followingId: targetId,
      });
      return follow.toObject ? follow.toObject() : follow;
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException('Already following this member');
      }
      throw error;
    }
  }
}

