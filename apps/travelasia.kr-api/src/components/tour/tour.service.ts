import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tour } from '../../schemas/Tour.model';

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
}

