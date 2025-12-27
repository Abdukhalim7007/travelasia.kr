import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Visited } from '../../schemas/Visited.model';

@Injectable()
export class VisitedService {
  constructor(@InjectModel(Visited.name) private readonly visitedModel: Model<Visited>) {}

  async recordVisit(memberId: string, tourId: string): Promise<boolean> {
    await this.visitedModel.create({ memberId, tourId });
    return true;
  }

  async getMyVisitedTours(memberId: string): Promise<any[]> {
    return this.visitedModel.find({ memberId }).sort({ visitedAt: -1 }).lean().exec();
  }

  async getVisited(memberId: string, input?: any): Promise<{ list: any[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      sort = 'visitedAt',
      direction = -1,
    } = input || {};

    const filter: any = { memberId };

    const total = await this.visitedModel.countDocuments(filter).exec();
    const list = await this.visitedModel
      .find(filter)
      .sort({ [sort]: direction as any })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean()
      .exec();

    return { list, total };
  }

  async countViews(tourId: string): Promise<number> {
    return this.visitedModel.countDocuments({ tourId }).exec();
  }

  async getViewsCountsByTourIds(
    tourIds: (string | Types.ObjectId)[],
  ): Promise<Map<string, number>> {
    if (!tourIds || tourIds.length === 0) {
      return new Map();
    }

    const objectIds = tourIds.map((id) => (typeof id === 'string' ? new Types.ObjectId(id) : id));

    const result = await this.visitedModel.aggregate([
      { $match: { tourId: { $in: objectIds } } },
      { $group: { _id: '$tourId', count: { $sum: 1 } } },
    ]).exec();

    const viewsMap = new Map<string, number>();
    result.forEach((item) => {
      const tourIdStr = String(item._id);
      viewsMap.set(tourIdStr, item.count);
    });

    // Ensure all tourIds have entries (default to 0 if no views)
    tourIds.forEach((id) => {
      const idStr = String(id);
      if (!viewsMap.has(idStr)) {
        viewsMap.set(idStr, 0);
      }
    });

    return viewsMap;
  }
}
