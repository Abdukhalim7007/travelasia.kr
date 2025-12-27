import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from '../../schemas/Comment.model';
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
    });
  }

  async getReviewsByTour(tourId: string): Promise<any[]> {
    return this.commentModel.find({ tourId }).sort({ createdAt: -1 }).lean().exec();
  }

  async countReviews(tourId: string): Promise<number> {
    return this.commentModel.countDocuments({ tourId }).exec();
  }

  async getAverageRating(tourId: string): Promise<number> {
    const result = await this.commentModel.aggregate([
      { $match: { tourId: tourId } },
      { $group: { _id: '$tourId', averageRating: { $avg: '$rating' } } },
    ]).exec();

    return result.length > 0 ? result[0].averageRating : 0;
  }
}
