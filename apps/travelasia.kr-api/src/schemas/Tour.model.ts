import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { TourType, TourStatus, TourGroupType } from '../libs/enums/tour.enum';

@Schema({ timestamps: true })
export class Tour extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ type: String, enum: TourType, required: true })
  tourType: TourType;

  @Prop({ type: String, enum: TourStatus, default: TourStatus.DRAFT })
  status: TourStatus;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Member', required: true })
  agentId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  tourPrice: number;

  @Prop()
  durationNights?: number;

  @Prop({ type: String, enum: TourGroupType })
  groupType?: TourGroupType;

  @Prop([String])
  images?: string[];

  @Prop()
  description?: string;

  @Prop([String])
  inclusions?: string[];

  @Prop([String])
  exclusions?: string[];
}

export const TourSchema = SchemaFactory.createForClass(Tour);




