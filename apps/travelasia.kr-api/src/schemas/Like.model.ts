import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { LikeTargetType } from '../libs/enums/like.enum';

@Schema({ timestamps: true })
export class Like extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Member', required: true })
  memberId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  targetId: MongooseSchema.Types.ObjectId;

  @Prop({ type: String, enum: LikeTargetType, required: true })
  targetType: LikeTargetType;
}

export const LikeSchema = SchemaFactory.createForClass(Like);

LikeSchema.index({ memberId: 1, targetId: 1, targetType: 1 }, { unique: true });

