import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tour } from '../../schemas/Tour.model';
import { TourInput } from '../../libs/dto/tour/tour.input';
import { TourUpdate } from '../../libs/dto/tour/tour.update';
import { ToursInquiry } from '../../libs/dto/tour/tours.inquiry';
import { ToursResponse } from '../../libs/dto/tour/tours.response';
import { createWriteStream, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { CommentService } from '../comment/comment.service';
import { LikeService } from '../like/like.service';
import { VisitedService } from '../visited/visited.service';
import { FavoriteService } from '../favorite/favorite.service';
import { LikeTargetType } from '../../libs/enums/like.enum';
import { TourStatus } from '../../libs/enums/tour.enum';

@Injectable()
export class TourService {
  constructor(
    @InjectModel(Tour.name) private readonly tourModel: Model<Tour>,
    private readonly commentService: CommentService,
    private readonly likeService: LikeService,
    private readonly visitedService: VisitedService,
    private readonly favoriteService: FavoriteService,
  ) {}

  async getTours(input: ToursInquiry, memberId?: string): Promise<ToursResponse> {
    const {
      page = 1,
      limit = 12,
      sort = 'createdAt',
      direction = -1,
      search,
      location,
      type,
      minPrice,
      maxPrice,
    } = input;

    const filter: any = {
      status: TourStatus.ACTIVE,
    };

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    if (type) {
      filter.tourType = type;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.tourPrice = {};
      if (minPrice !== undefined) filter.tourPrice.$gte = minPrice;
      if (maxPrice !== undefined) filter.tourPrice.$lte = maxPrice;
    }

    const total = await this.tourModel.countDocuments(filter).exec();
    const list = await this.tourModel
      .find(filter)
      .sort({ [sort]: direction as any })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .exec();

    // Batch load stats
    if (list.length > 0) {
      const tourIds = list.map((tour) => tour._id);
      const batchPromises: Promise<any>[] = [
        this.commentService.getReviewStatsByTourIds(tourIds),
        this.likeService.getCountsByTargetIds(tourIds, LikeTargetType.TOUR),
        this.visitedService.getViewsCountsByTourIds(tourIds),
      ];

      if (memberId) {
        batchPromises.push(
          this.likeService.getMeLikedMap(memberId, tourIds, LikeTargetType.TOUR),
          this.favoriteService.getFavoritedMap(memberId, tourIds),
        );
      }

      const results = await Promise.all(batchPromises);
      const statsMap = results[0];
      const likesMap = results[1];
      const viewsMap = results[2];
      const meLikedMap = memberId ? results[3] : null;
      const meFavoritedMap = memberId ? results[4] : null;

      list.forEach((tour: any) => {
        const tourIdStr = String(tour._id);
        const stats = statsMap.get(tourIdStr) || { count: 0, avg: 0 };
        tour.reviewsCount = stats.count;
        tour.averageRating = stats.avg;
        tour.likesCount = likesMap.get(tourIdStr) || 0;
        tour.viewsCount = viewsMap.get(tourIdStr) || 0;
        tour.meLiked = meLikedMap ? Boolean(meLikedMap.get(tourIdStr)) : false;
        tour.meFavorited = meFavoritedMap ? Boolean(meFavoritedMap.get(tourIdStr)) : false;
      });
    }

    return { list: list as any, total };
  }

  async getAllTours(memberId?: string): Promise<any[]> {
    const list = await this.tourModel.find().lean().exec();

    // Batch load stats
    if (list.length > 0) {
      const tourIds = list.map((tour) => tour._id);
      const [statsMap, likesMap, viewsMap] = await Promise.all([
        this.commentService.getReviewStatsByTourIds(tourIds),
        this.likeService.getCountsByTargetIds(tourIds, LikeTargetType.TOUR),
        this.visitedService.getViewsCountsByTourIds(tourIds),
      ]);

      list.forEach((tour: any) => {
        const tourIdStr = String(tour._id);
        const stats = statsMap.get(tourIdStr) || { count: 0, avg: 0 };
        tour.reviewsCount = stats.count;
        tour.averageRating = stats.avg;
        tour.likesCount = likesMap.get(tourIdStr) || 0;
        tour.viewsCount = viewsMap.get(tourIdStr) || 0;
      });
    }

    return list;
  }

  async getTourById(tourId: string, memberId?: string): Promise<any> {
    const tour = await this.tourModel.findById(tourId).lean().exec();
    if (!tour) throw new NotFoundException('Tour not found');

    // Batch load stats (single tour)
    const tourIdStr = String(tour._id);
    const batchPromises: Promise<any>[] = [
      this.commentService.getReviewStatsByTourIds([tourId]),
      this.likeService.getCountsByTargetIds([tourId], LikeTargetType.TOUR),
      this.visitedService.getViewsCountsByTourIds([tourId]),
    ];

    if (memberId) {
      batchPromises.push(
        this.likeService.getMeLikedMap(memberId, [tourId], LikeTargetType.TOUR),
        this.favoriteService.getFavoritedMap(memberId, [tourId]),
      );
    }

    const results = await Promise.all(batchPromises);
    const statsMap = results[0];
    const likesMap = results[1];
    const viewsMap = results[2];
    const meLikedMap = memberId ? results[3] : null;
    const meFavoritedMap = memberId ? results[4] : null;

    const stats = statsMap.get(tourIdStr) || { count: 0, avg: 0 };
    (tour as any).reviewsCount = stats.count;
    (tour as any).averageRating = stats.avg;
    (tour as any).likesCount = likesMap.get(tourIdStr) || 0;
    (tour as any).viewsCount = viewsMap.get(tourIdStr) || 0;
    (tour as any).meLiked = meLikedMap ? Boolean(meLikedMap.get(tourIdStr)) : false;
    (tour as any).meFavorited = meFavoritedMap ? Boolean(meFavoritedMap.get(tourIdStr)) : false;

    return tour;
  }

  async getToursByAgent(agentId: string, memberId?: string): Promise<any[]> {
    const list = await this.tourModel.find({ agentId }).lean().exec();

    // Batch load stats
    if (list.length > 0) {
      const tourIds = list.map((tour) => tour._id);
      const batchPromises: Promise<any>[] = [
        this.commentService.getReviewStatsByTourIds(tourIds),
        this.likeService.getCountsByTargetIds(tourIds, LikeTargetType.TOUR),
        this.visitedService.getViewsCountsByTourIds(tourIds),
      ];

      if (memberId) {
        batchPromises.push(
          this.likeService.getMeLikedMap(memberId, tourIds, LikeTargetType.TOUR),
          this.favoriteService.getFavoritedMap(memberId, tourIds),
        );
      }

      const results = await Promise.all(batchPromises);
      const statsMap = results[0];
      const likesMap = results[1];
      const viewsMap = results[2];
      const meLikedMap = memberId ? results[3] : null;
      const meFavoritedMap = memberId ? results[4] : null;

      list.forEach((tour: any) => {
        const tourIdStr = String(tour._id);
        const stats = statsMap.get(tourIdStr) || { count: 0, avg: 0 };
        tour.reviewsCount = stats.count;
        tour.averageRating = stats.avg;
        tour.likesCount = likesMap.get(tourIdStr) || 0;
        tour.viewsCount = viewsMap.get(tourIdStr) || 0;
        tour.meLiked = meLikedMap ? Boolean(meLikedMap.get(tourIdStr)) : false;
        tour.meFavorited = meFavoritedMap ? Boolean(meFavoritedMap.get(tourIdStr)) : false;
      });
    }

    return list;
  }

  async createTour(agentId: string, input: TourInput): Promise<any> {
    const created = await this.tourModel.create({ ...input, agentId });
    return created.toObject ? created.toObject() : created;
  }

  async updateTour(agentId: string, input: TourUpdate): Promise<any> {
    const { _id, ...updates } = input;

    const tour = await this.tourModel.findOneAndUpdate(
      { _id, agentId },
      { $set: updates },
      { new: true, lean: true }
    ).exec();

    if (!tour) {
      throw new NotFoundException('Tour not found or access denied');
    }
    return tour;
  }

  async removeTour(agentId: string, tourId: string): Promise<boolean> {
    const result = await this.tourModel.deleteOne({ _id: tourId, agentId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Tour not found or access denied');
    }
    return true;
  }

  async uploadTourImages(agentId: string, tourId: string, files: any[]): Promise<any> {
    const tour = await this.tourModel.findOne({ _id: tourId, agentId }).exec();
    if (!tour) throw new NotFoundException('Tour not found or access denied');

    const uploadDir = join(process.cwd(), `public/uploads/tours/${tourId}`);
    if (!existsSync(uploadDir)) {
      mkdirSync(uploadDir, { recursive: true });
    }

    const paths = await Promise.all(
      files.map(async (file) => {
        const { createReadStream, filename } = await file;
        const uniqueFilename = `${Date.now()}_${filename}`;
        const filePath = join(uploadDir, uniqueFilename);
        const savedPath = `/uploads/tours/${tourId}/${uniqueFilename}`;

        return new Promise<string>((resolve, reject) => {
          createReadStream()
            .pipe(createWriteStream(filePath))
            .on('finish', () => resolve(savedPath))
            .on('error', (err: any) => reject(err));
        });
      }),
    );

    return this.tourModel
      .findByIdAndUpdate(tourId, { $push: { images: { $each: paths } } }, { new: true, lean: true })
      .exec();
  }

  async getAllToursByAdmin(memberId?: string): Promise<any[]> {
    const list = await this.tourModel.find().sort({ createdAt: -1 }).lean().exec();

    // Batch load stats
    if (list.length > 0) {
      const tourIds = list.map((tour) => tour._id);
      const batchPromises: Promise<any>[] = [
        this.commentService.getReviewStatsByTourIds(tourIds),
        this.likeService.getCountsByTargetIds(tourIds, LikeTargetType.TOUR),
        this.visitedService.getViewsCountsByTourIds(tourIds),
      ];

      if (memberId) {
        batchPromises.push(
          this.likeService.getMeLikedMap(memberId, tourIds, LikeTargetType.TOUR),
          this.favoriteService.getFavoritedMap(memberId, tourIds),
        );
      }

      const results = await Promise.all(batchPromises);
      const statsMap = results[0];
      const likesMap = results[1];
      const viewsMap = results[2];
      const meLikedMap = memberId ? results[3] : null;
      const meFavoritedMap = memberId ? results[4] : null;

      list.forEach((tour: any) => {
        const tourIdStr = String(tour._id);
        const stats = statsMap.get(tourIdStr) || { count: 0, avg: 0 };
        tour.reviewsCount = stats.count;
        tour.averageRating = stats.avg;
        tour.likesCount = likesMap.get(tourIdStr) || 0;
        tour.viewsCount = viewsMap.get(tourIdStr) || 0;
        tour.meLiked = meLikedMap ? Boolean(meLikedMap.get(tourIdStr)) : false;
        tour.meFavorited = meFavoritedMap ? Boolean(meFavoritedMap.get(tourIdStr)) : false;
      });
    }

    return list;
  }

  async removeTourByAdmin(tourId: string): Promise<boolean> {
    const result = await this.tourModel.deleteOne({ _id: tourId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException('Tour not found');
    }
    return true;
  }
}

