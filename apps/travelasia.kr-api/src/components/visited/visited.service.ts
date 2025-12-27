import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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

  async countViews(tourId: string): Promise<number> {
    return this.visitedModel.countDocuments({ tourId }).exec();
  }
}
