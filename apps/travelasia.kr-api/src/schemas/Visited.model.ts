import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Visited extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Member', required: true })
  memberId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Tour', required: true })
  tourId: MongooseSchema.Types.ObjectId;

  @Prop({ type: Date, default: () => new Date() })
  visitedAt: Date;
}

export const VisitedSchema = SchemaFactory.createForClass(Visited);
VisitedSchema.index({ memberId: 1, tourId: 1 });

