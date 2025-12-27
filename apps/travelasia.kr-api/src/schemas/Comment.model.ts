import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Comment extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Tour', required: true })
  tourId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Member', required: true })
  memberId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ required: true })
  content: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);

CommentSchema.index({ tourId: 1, createdAt: -1 });
CommentSchema.index({ memberId: 1 });
CommentSchema.index({ tourId: 1, memberId: 1 }, { unique: true });

