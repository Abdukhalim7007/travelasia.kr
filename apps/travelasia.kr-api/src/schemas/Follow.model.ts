import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Follow extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Member', required: true })
  followerId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Member', required: true })
  followingId: MongooseSchema.Types.ObjectId;
}

export const FollowSchema = SchemaFactory.createForClass(Follow);

// Create unique compound index to prevent duplicate follows
FollowSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

