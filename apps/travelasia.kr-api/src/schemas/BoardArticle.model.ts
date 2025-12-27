import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum BoardArticleStatus {
  ACTIVE = 'ACTIVE',
  BLOCKED = 'BLOCKED',
  DELETED = 'DELETED',
}

@Schema({ timestamps: true })
export class BoardArticle extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Member', required: true })
  authorId: MongooseSchema.Types.ObjectId;

  @Prop({ type: String, enum: BoardArticleStatus, default: BoardArticleStatus.ACTIVE })
  status: BoardArticleStatus;

  @Prop({ type: Number, default: 0 })
  viewsCount: number;
}

export const BoardArticleSchema = SchemaFactory.createForClass(BoardArticle);
BoardArticleSchema.index({ createdAt: -1 });
BoardArticleSchema.index({ status: 1, createdAt: -1 });

