import { ConflictException, Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentStatus } from '../../schemas/Comment.model';
import { Tour } from '../../schemas/Tour.model';
import { CreateCommentInput, UpdateReviewInput } from '../../libs/dto/comment/comment.input';
import { CommentsInquiry } from '../../libs/dto/comment/comments.inquiry';
import { CommentsResponse } from '../../libs/dto/comment/comments.response';
import { MemberType } from '../../libs/enums/member.enum';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private readonly commentModel: Model<Comment>,
    @InjectModel(Tour.name) private readonly tourModel: Model<Tour>,
  ) {}

  async createReview(memberId: string, input: CreateCommentInput): Promise<any> {
    const tour = await this.tourModel.findById(input.tourId).exec();
    if (!tour) throw new NotFoundException('Tour not found');

    const existing = await this.commentModel.findOne({ tourId: input.tourId, memberId }).exec();
    if (existing) throw new ConflictException('You have already reviewed this tour');

    return this.commentModel.create({
      ...input,
      memberId,
      status: CommentStatus.ACTIVE,
    });
  }

  async getReviewsByTour(tourId: string, input?: CommentsInquiry): Promise<CommentsResponse> {
    const {
      page = 1,
      limit = 10,
      sort = 'createdAt',
      direction = -1,
    } = input || {};

    const filter: any = {
      tourId: new Types.ObjectId(tourId),
      status: CommentStatus.ACTIVE,
    };

    const total = await this.commentModel.countDocuments(filter).exec();
    const list = await this.commentModel
      .find(filter)
      .sort({ [sort]: direction as any })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .exec();

    return { list: list as any, total };
  }

  async countReviews(tourId: string): Promise<number> {
    return this.commentModel.countDocuments({ tourId, status: CommentStatus.ACTIVE }).exec();
  }

  async getAverageRating(tourId: string): Promise<number> {
    const result = await this.commentModel.aggregate([
      { $match: { tourId: tourId, status: CommentStatus.ACTIVE } },
      { $group: { _id: '$tourId', averageRating: { $avg: '$rating' } } },
    ]).exec();

    return result.length > 0 ? result[0].averageRating : 0;
  }

  async getReviewStatsByTourIds(tourIds: (string | Types.ObjectId)[]): Promise<Map<string, { count: number; avg: number }>> {
    if (!tourIds || tourIds.length === 0) {
      return new Map();
    }

    const objectIds = tourIds.map((id) => (typeof id === 'string' ? new Types.ObjectId(id) : id));

    const result = await this.commentModel.aggregate([
      { $match: { tourId: { $in: objectIds }, status: CommentStatus.ACTIVE } },
      {
        $group: {
          _id: '$tourId',
          count: { $sum: 1 },
          avg: { $avg: '$rating' },
        },
      },
    ]).exec();

    const statsMap = new Map<string, { count: number; avg: number }>();
    result.forEach((item) => {
      const tourIdStr = String(item._id);
      statsMap.set(tourIdStr, {
        count: item.count,
        avg: item.avg || 0,
      });
    });

    // Ensure all tourIds have entries (default to 0 if no reviews)
    tourIds.forEach((id) => {
      const idStr = String(id);
      if (!statsMap.has(idStr)) {
        statsMap.set(idStr, { count: 0, avg: 0 });
      }
    });

    return statsMap;
  }

  async updateReview(memberId: string, reviewId: string, input: UpdateReviewInput): Promise<any> {
    const review = await this.commentModel
      .findOne({ _id: reviewId, status: { $ne: CommentStatus.DELETED } })
      .lean()
      .exec();

    if (!review) throw new NotFoundException('Review not found');

    // Permission check: only owner can update
    if (String(review.memberId) !== memberId) {
      throw new ForbiddenException('You do not have permission to update this review');
    }

    const updateData: any = {};
    if (input.rating !== undefined) updateData.rating = input.rating;
    if (input.content !== undefined) updateData.content = input.content;

    const updated = await this.commentModel
      .findByIdAndUpdate(reviewId, { $set: updateData }, { new: true, lean: true })
      .exec();

    return updated;
  }

  async removeReview(memberId: string, memberType: MemberType, reviewId: string): Promise<boolean> {
    const review = await this.commentModel
      .findOne({ _id: reviewId, status: { $ne: CommentStatus.DELETED } })
      .lean()
      .exec();

    if (!review) throw new NotFoundException('Review not found');

    // Permission check: ADMIN can remove any, others can only remove their own
    if (memberType !== MemberType.ADMIN && String(review.memberId) !== memberId) {
      throw new ForbiddenException('You do not have permission to remove this review');
    }

    await this.commentModel
      .findByIdAndUpdate(reviewId, { $set: { status: CommentStatus.DELETED } })
      .exec();

    return true;
  }
}
