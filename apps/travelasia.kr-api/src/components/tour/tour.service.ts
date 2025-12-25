import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tour } from '../../schemas/Tour.model';
import { TourInput } from '../../libs/dto/tour/tour.input';

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
}

