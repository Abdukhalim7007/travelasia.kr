import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment, CommentStatus } from '../../schemas/Comment.model';
import { Tour } from '../../schemas/Tour.model';
import { CreateCommentInput } from '../../libs/dto/comment/comment.input';

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

  async getReviewsByTour(tourId: string): Promise<any[]> {
    return this.commentModel
      .find({ tourId, status: CommentStatus.ACTIVE })
      .sort({ createdAt: -1 })
      .lean()
      .exec();
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
}
