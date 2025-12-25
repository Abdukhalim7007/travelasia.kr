import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tour } from '../../schemas/Tour.model';
import { TourInput } from '../../libs/dto/tour/tour.input';
import { TourUpdate } from '../../libs/dto/tour/tour.update';

@Injectable()
export class TourService {
  constructor(
    @InjectModel(Tour.name) private readonly tourModel: Model<Tour>,
  ) {}

  async getTours(): Promise<any[]> {
    return this.tourModel.find().lean().exec();
  }

  async getToursByAgent(agentId: string): Promise<any[]> {
    return this.tourModel.find({ agentId }).lean().exec();
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
}

